from flask import Flask, jsonify, request, Response, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import os
from models import db, User, AuctionItem, Bid, TokenBlocklist, EmailVerificationToken
from dotenv import load_dotenv
from datetime import timedelta, datetime
from flask_mail import Mail
from flask_cors import CORS
import logging

logging.basicConfig(level=logging.DEBUG)

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Configure CORS
CORS(app, 
    resources={
        r"/*": {
            "origins": "http://localhost:5173",  # Frontend URL for development
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    },
    supports_credentials=True
)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///auction.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['DEBUG'] = True

# JWT Configuration
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'fallback_secret_key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)

# Image upload configuration
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')  # Adjusted to current working directory
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Initialize extensions
db.init_app(app) 
migrate = Migrate(app, db)
jwt = JWTManager(app)
mail = Mail(app)

# Create upload directory if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Import models after db initialization
from models import User, AuctionItem, Bid, TokenBlocklist, EmailVerificationToken

# Register blueprints
from views.auth_blueprint import auth_bp
from views.user_blueprint import user_bp
from views.bids_blueprint import bids_bp
from views.auctionitem_blueprint import auctionitem_bp

app.register_blueprint(auth_bp)
app.register_blueprint(user_bp)
app.register_blueprint(bids_bp)
app.register_blueprint(auctionitem_bp)

# Serve uploaded files
@app.route('/uploads/<filename>')
def serve_image(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# JWT configuration to check revoked tokens
@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    jti = jwt_payload['jti']
    token = TokenBlocklist.query.filter_by(jti=jti).first()
    return token is not None

# Error handlers
@app.errorhandler(401)
def handle_unauthorized(e):
    return jsonify({"message": "Unauthorized"}), 401

@app.errorhandler(404)
def handle_not_found(e):
    return jsonify({"message": "Resource not found"}), 404

@app.errorhandler(500)
def handle_server_error(e):
    return jsonify({"message": "Internal server error"}), 500

# Request logging
@app.before_request
def log_request():
    app.logger.debug(f"Request: {request.method} {request.path}")

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
