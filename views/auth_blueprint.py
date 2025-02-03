from flask import jsonify, request, Blueprint
from models import db, User, TokenBlocklist
from werkzeug.security import check_password_hash
from datetime import datetime, timezone, timedelta
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt

auth_bp = Blueprint("auth_bp", __name__)

# Login
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    
    # Check if email and password are provided
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
    
    # Fetch user from the database
    user = User.query.filter_by(email=email).first()

    if user and check_password_hash(user.password, password):
        # Generate access token with expiration time (e.g., 1 hour)
        access_token = create_access_token(identity=user.id, expires_delta=timedelta(hours=1))
        
        # Include expiration info for the token (optional)
        response = {
            "access_token": access_token,
            "msg": "Login successful"
        }
        return jsonify(response), 200
    else:
        # Incorrect email/password
        return jsonify({"error": "Either email or password is incorrect"}), 401


# Current User
@auth_bp.route("/current_user", methods=["GET"])
@jwt_required()
def current_user():
    # Get user id from JWT
    current_user_id = get_jwt_identity()

    # Fetch the user from the database
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    # Prepare user data
    user_data = {
        'id': user.id,
        'email': user.email,
        'is_approved': user.is_approved,
        'is_admin': user.is_admin,
        'username': user.username,
        'created_at': user.created_at  # Optionally add timestamp of user creation
    }

    return jsonify(user_data), 200


# Logout
@auth_bp.route("/logout", methods=["DELETE"])
@jwt_required()
def logout():
    # Get the JWT ID from the current token
    jti = get_jwt()["jti"]
    now = datetime.now(timezone.utc)

    # Add the JWT to the blocklist to prevent it from being used again
    db.session.add(TokenBlocklist(jti=jti, created_at=now))
    db.session.commit()

    return jsonify({"msg": "Logged out successfully"}), 200


# Refresh Token (New feature)
@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    current_user_id = get_jwt_identity()
    
    # Create new access token
    new_access_token = create_access_token(identity=current_user_id, expires_delta=timedelta(hours=1))
    
    return jsonify({"access_token": new_access_token}), 200

