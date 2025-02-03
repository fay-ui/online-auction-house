from flask import Blueprint, request, jsonify
from models import db, AuctionItem, User
from flask_jwt_extended import jwt_required, get_jwt_identity

auctionitem_bp = Blueprint('auctionitem_bp', __name__)

# Create a new auction item
@auctionitem_bp.route('/create', methods=['POST'])
@jwt_required()
def create_auction_item():
    user_id = get_jwt_identity()
    data = request.get_json()

    # Ensure all required data is provided
    title = data.get('title')
    description = data.get('description')
    starting_price = data.get('starting_price')

    if not title or not description or not starting_price:
        return jsonify({"msg": "title, description, and starting_price are required"}), 400
    
    try:
        starting_price = float(starting_price)  # Ensure it's a valid number
    except ValueError:
        return jsonify({"msg": "Starting price must be a valid number"}), 400

    # Validate the starting price (must be positive)
    if starting_price <= 0:
        return jsonify({"msg": "Starting price must be greater than 0"}), 400

    # Create a new auction item
    new_item = AuctionItem(
        title=title, 
        description=description, 
        starting_price=starting_price, 
        seller_id=user_id
    )
    db.session.add(new_item)
    db.session.commit()

    return jsonify({"msg": "Auction item created successfully", "item_id": new_item.id}), 201

# View auction item details
@auctionitem_bp.route('/<int:item_id>', methods=['GET'])
def view_auction_item(item_id):
    item = AuctionItem.query.get_or_404(item_id)
    return jsonify({
        "id": item.id,
        "title": item.title, 
        "description": item.description, 
        "starting_price": item.starting_price,
        "created_at": item.created_at,  # Optionally include timestamps
        "updated_at": item.updated_at  # Optionally include timestamps
    }), 200

# Get all auction items (with optional pagination)
@auctionitem_bp.route('/', methods=['GET'])
def get_all_auction_items():
    # Pagination parameters (optional)
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)

    items = AuctionItem.query.paginate(page, per_page, False).items
    if not items:
        return jsonify({"msg": "No auction items found"}), 404

    auction_items = [{
        "id": item.id,
        "title": item.title,
        "description": item.description,
        "starting_price": item.starting_price,
        "created_at": item.created_at,
        "updated_at": item.updated_at
    } for item in items]

    return jsonify({"auction_items": auction_items, "page": page}), 200

# Update an existing auction item
@auctionitem_bp.route('/<int:item_id>', methods=['PUT'])
@jwt_required()
def update_auction_item(item_id):
    user_id = get_jwt_identity()
    item = AuctionItem.query.get_or_404(item_id)

    # Ensure the current user is the seller of the auction item
    if item.seller_id != user_id:
        return jsonify({"msg": "You are not authorized to update this auction item"}), 403

    data = request.get_json()

    title = data.get('title')
    description = data.get('description')
    starting_price = data.get('starting_price')

    # Validate the input (ensure starting price is valid)
    if starting_price and starting_price <= 0:
        return jsonify({"msg": "Starting price must be greater than 0"}), 400

    # Update auction item data
    if title:
        item.title = title
    if description:
        item.description = description
    if starting_price:
        item.starting_price = float(starting_price)  # Ensure it's a valid number

    db.session.commit()

    return jsonify({"msg": "Auction item updated successfully"}), 200

# Delete an auction item
@auctionitem_bp.route('/<int:item_id>', methods=['DELETE'])
@jwt_required()
def delete_auction_item(item_id):
    user_id = get_jwt_identity()
    item = AuctionItem.query.get_or_404(item_id)

    # Ensure the current user is the seller of the auction item
    if item.seller_id != user_id:
        return jsonify({"msg": "You are not authorized to delete this auction item"}), 403

    db.session.delete(item)
    db.session.commit()

    return jsonify({"msg": "Auction item deleted successfully"}), 200
