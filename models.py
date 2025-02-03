# models.py
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

# Define db here, but don’t initialize it yet.
db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    is_verified = db.Column(db.Boolean, default=False)  # Field to track if the user is verified

    def __repr__(self):
        return f'<User {self.username}>'

class AuctionItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    starting_price = db.Column(db.Float, nullable=False)
    seller_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    seller = db.relationship('User', backref=db.backref('auction_items', lazy=True))

    def __repr__(self):
        return f'<AuctionItem {self.title}>'

class Bid(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    auction_item_id = db.Column(db.Integer, db.ForeignKey('auction_item.id'), nullable=False)
    auction_item = db.relationship('AuctionItem', backref=db.backref('bids', lazy=True))
    bidder_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    bidder = db.relationship('User', backref=db.backref('bids', lazy=True))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f'<Bid {self.amount}>'

class TokenBlocklist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def __repr__(self):
        return f"<TokenBlocklist {self.jti}>"

# New model for Email Verification Tokens
class EmailVerificationToken(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    token = db.Column(db.String(100), unique=True, nullable=False)  # Store the verification token
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', backref=db.backref('verification_tokens', lazy=True))
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    
    def __repr__(self):
        return f"<EmailVerificationToken {self.token}>"
