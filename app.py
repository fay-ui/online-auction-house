
from flask import Flask, jsonify, request, Response, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import os
from dotenv import load_dotenv
from datetime import timedelta
from flask_mail import Mail
from flask_cors import CORS
import logging

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Initialize the CORS (allow specific origin for now)
CORS(app, resources={r"/*": {"origins": os.getenv('ALLOWED_ORIGIN', 'http://localhost:5173')}})

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///auction.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy()
# JWT Configuration
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'tryghjmpok')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)

# Image upload configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Initialize the database, migrations, and JWT manager
db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

# Ensure uploads folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Define the AuctionItem model
class AuctionItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200), nullable=False)
    starting_price = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String(200), nullable=True)

    def __repr__(self):
        return f'<AuctionItem {self.title}>'

# Register Blueprints
from views.auth_blueprint import auth_bp
from views.user_blueprint import user_bp
from views.bids_blueprint import bids_bp
from views.auctionitem_blueprint import auctionitem_bp

app.register_blueprint(auth_bp)
app.register_blueprint(user_bp)
app.register_blueprint(bids_bp)
app.register_blueprint(auctionitem_bp)

# Route for the home page
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

# Token blacklist callback (Optional, if implementing token revocation)
@jwt.token_in_blocklist_loader
def check_if_token_in_blocklist(jwt_header, decrypted_token):
    jti = decrypted_token['jti']
    return TokenBlocklist.query.filter_by(jti=jti).first() is not None

# Error handlers
@app.errorhandler(401)
def handle_unauthorized_error(e):
    return jsonify({"message": "Unauthorized access, please log in."}), 401

@app.errorhandler(500)
def handle_internal_error(e):
    return jsonify({"message": "Internal Server Error."}), 500

@app.errorhandler(404)
def handle_not_found_error(e):
    return jsonify({"message": "Resource not found"}), 404

# Log incoming request information (for debugging)
@app.before_request
def log_request_info():
    app.logger.debug(f"Request Headers: {request.headers}")

# Log response headers (for debugging)
@app.after_request
def log_response_info(response):
    app.logger.debug(f"Response Headers: {response.headers}")
    return response

# Handling OPTIONS preflight request (if needed)
@app.route('/api/<path:path>', methods=['OPTIONS'])
def handle_options(path):
    response = Response()  # Use Response directly
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:5173'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response

# Helper function for image validation
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Auction Item Route (POST request to create auction item)
@app.route('/api/items', methods=['POST'])
@jwt_required()
def add_auction_item():
    # Ensure the necessary fields are provided in the request
    title = request.form['title']
    description = request.form['description']
    price = request.form['price']

    # Validate price
    try:
        price = float(price)
    except ValueError:
        return jsonify({"msg": "Price must be a valid number"}), 400
    
    # Image Handling (if provided)
    image_url = None
    if 'image' in request.files:
        image = request.files['image']
        if image and allowed_file(image.filename):
            filename = secure_filename(image.filename)
            image.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            image_url = os.path.join(UPLOAD_FOLDER, filename)  # Storing the relative URL of the image
        else:
            return jsonify({"msg": "Invalid image format, allowed formats are PNG, JPG, JPEG, GIF."}), 400

    # Creating and saving the auction item
    new_item = AuctionItem(
        title=title,
        description=description,
        starting_price=price,
        image_url=image_url  # Saving the image URL or None if no image is uploaded
    )
    db.session.add(new_item)
    db.session.commit()

    return jsonify({"msg": "Auction item added successfully!"}), 201

# Serve uploaded images (added this route to allow serving images)
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Login Route: Create both access and refresh tokens
@app.route('/api/login', methods=['POST'])
def login():
    email = request.json.get('email', None)
    password = request.json.get('password', None)

    # Mock user check (replace with real check)
    user = User.query.filter_by(email=email).first()

    if user and user.check_password(password):  # Assuming user has a `check_password` method
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        return jsonify(access_token=access_token, refresh_token=refresh_token), 200
    else:
        return jsonify({"msg": "Invalid credentials"}), 401

# Refresh Token Route: Get new access token using refresh token
@app.route('/api/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh_token():
    current_user = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user)
    return jsonify(access_token=new_access_token), 200

# Logout Route: Optionally, blacklist refresh token
@app.route('/api/logout', methods=['POST'])
@jwt_required(refresh=True)
def logout():
    jti = get_jwt()['jti']  # Get the JWT ID (unique identifier for this token)
    
    # Here you would typically add this `jti` to a database or cache blacklist
    # This way, the refresh token cannot be used again to get a new access token
    # For simplicity, we're not implementing the blacklist here.
    
    return jsonify(msg="Successfully logged out"), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create all tables before running the app
    app.run(debug=True)
