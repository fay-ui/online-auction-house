from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

# Initialize the db (do this in models.py, not app.py)
db = SQLAlchemy()

# User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    is_verified = db.Column(db.Boolean, default=False)  # Field to track if the user is verified

    def __repr__(self):
        return f'<User {self.username}>'

# AuctionItem model
class AuctionItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  # Ensure created_at field is defined here
    starting_price = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String(255), nullable=True)  # Add image_url to store the path to the image
    seller_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Reference to User model
    seller = db.relationship('User', backref=db.backref('auction_items', lazy=True))

    def __repr__(self):
        return f'<AuctionItem {self.title}>'

# Bid model
class Bid(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    auction_item_id = db.Column(db.Integer, db.ForeignKey('auction_item.id'), nullable=False)  # Reference to AuctionItem model
    auction_item = db.relationship('AuctionItem', backref=db.backref('bids', lazy=True))
    bidder_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Reference to User model
    bidder = db.relationship('User', backref=db.backref('bids', lazy=True))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f'<Bid {self.amount}>'

# TokenBlocklist model for JWT token revocation (if needed)
class TokenBlocklist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), unique=True, nullable=False)  # JWT ID
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)  # When the token was revoked

    def __repr__(self):
        return f"<TokenBlocklist {self.jti}>"

# EmailVerificationToken model for email verification (optional)
class EmailVerificationToken(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    token = db.Column(db.String(100), unique=True, nullable=False)  # Token for email verification
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Reference to User model
    user = db.relationship('User', backref=db.backref('verification_tokens', lazy=True))  # Relationship with User
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)  # When the token was created

    def __repr__(self):
        return f"<EmailVerificationToken {self.token}>"
