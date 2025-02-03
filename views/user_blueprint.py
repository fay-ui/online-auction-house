from flask import Blueprint, jsonify, request
from models import db, User
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from werkzeug.security import generate_password_hash, check_password_hash
import re

user_bp = Blueprint("user_bp", __name__)

# Create a new user (Registration)
@user_bp.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()
    
    # Ensure the required data is provided
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    if not username or not email or not password:
        return jsonify({"msg": "username, email, and password are required"}), 400

    # Validate email format
    email_regex = r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)"
    if not re.match(email_regex, email):
        return jsonify({"msg": "Invalid email format"}), 400

    # Check if the email already exists
    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "Email already exists"}), 400
    
    # Password length check (for minimum security)
    if len(password) < 6:
        return jsonify({"msg": "Password must be at least 6 characters long"}), 400
    
    # Hash the password before storing it
    hashed_password = generate_password_hash(password)
    
    # Create the new user
    new_user = User(username=username, email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    # Create an access token for the user with expiration time (e.g., 1 hour)
    access_token = create_access_token(identity=new_user.id, expires_delta=False)  # Set your expiration time here
    
    return jsonify(msg="User registered successfully", access_token=access_token), 201


# Fetch user profile
@user_bp.route('/<int:user_id>', methods=['GET'])
def get_user_profile(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify(
        id=user.id,
        username=user.username,
        email=user.email,
        is_approved=user.is_approved,
        is_admin=user.is_admin
    ), 200


# Update user profile
@user_bp.route('/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user_profile(user_id):
    current_user_id = get_jwt_identity()
    if current_user_id != user_id:
        return jsonify({"msg": "You can only update your own profile"}), 403

    user = User.query.get_or_404(user_id)
    data = request.get_json()
    
    # Check if new email is already taken
    if data.get('email') and User.query.filter_by(email=data.get('email')).first():
        return jsonify({"msg": "Email is already taken."}), 400

    # Update user profile information
    user.username = data.get('username', user.username)
    user.email = data.get('email', user.email)
    
    db.session.commit()
    return jsonify(msg="User profile updated successfully"), 200


# Delete user account
@user_bp.route('/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user_account(user_id):
    current_user_id = get_jwt_identity()
    if current_user_id != user_id:
        return jsonify({"msg": "You can only delete your own account"}), 403

    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()

    return jsonify(msg="User account deleted successfully"), 200
