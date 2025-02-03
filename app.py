from flask import Flask,jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from models import db, TokenBlocklist
from views.auth_blueprint import auth_bp
from views.user_blueprint import user_bp
from views.bids_blueprint import bids_bp
from views.auctionitem_blueprint import auctionitem_bp
from datetime import timedelta
from flask_mail import Mail
import os
from dotenv import load_dotenv
from flask_cors import CORS
import logging

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Initialize the CORS
CORS(app, resources={r"/*": {"origins": "*"}})

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///auction.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# JWT Configuration
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'tryghjmpok')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)

# Initialize the database, migrations, and JWT manager
db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

# Register Blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(user_bp)
app.register_blueprint(bids_bp)
app.register_blueprint(auctionitem_bp)

@app.route('/')
def index():
    return "Welcome to the Auction House!"

# Flask-Mail configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_USERNAME')

mail = Mail(app)

# Token blacklist callback
@jwt.token_in_blocklist_loader
def check_if_token_in_blocklist(decrypted_token):
    jti = decrypted_token['jti']
    return TokenBlocklist.query.filter_by(jti=jti).first() is not None

# Error handlers
@app.errorhandler(401)
def handle_unauthorized_error(e):
    return jsonify({"message": "Unauthorized access, please log in."}), 401

@app.errorhandler(500)
def handle_internal_error(e):
    return jsonify({"message": "Internal Server Error."}), 500

if __name__ == '__main__':
    app.run(debug=False)
