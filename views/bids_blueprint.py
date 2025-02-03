from flask import Blueprint, request, jsonify
from models import db, Bid, AuctionItem
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

bids_bp = Blueprint('bids_bp', __name__)

# Place a bid
@bids_bp.route('/place_bid', methods=['POST'])
@jwt_required()
def place_bid():
    user_id = get_jwt_identity()
    data = request.get_json()

    # Ensure bid data is present in the request
    auction_item_id = data.get('auction_item_id')
    amount = data.get('amount')

    if not auction_item_id or not amount:
        return jsonify({"msg": "auction_item_id and amount are required"}), 400

    if amount <= 0:
        return jsonify({"msg": "Bid amount must be greater than zero"}), 400

    # Fetch the auction item
    auction_item = AuctionItem.query.get(auction_item_id)
    if not auction_item:
        return jsonify({"msg": "Auction item not found"}), 404

    # Check if auction has ended
    if auction_item.end_time and datetime.utcnow() > auction_item.end_time:
        return jsonify({"msg": "Auction has already ended, no more bids can be placed"}), 400

    # Check if the bid is greater than the starting price and any existing highest bid
    highest_bid = Bid.query.filter_by(auction_item_id=auction_item_id).order_by(Bid.amount.desc()).first()
    if highest_bid and amount <= highest_bid.amount:
        return jsonify({"msg": f"Bid must be greater than the current highest bid of {highest_bid.amount}"}), 400
    elif amount <= auction_item.starting_price:
        return jsonify({"msg": f"Bid must be greater than the starting price of {auction_item.starting_price}"}), 400

    try:
        # Create a new bid
        new_bid = Bid(amount=amount, auction_item_id=auction_item_id, bidder_id=user_id)
        db.session.add(new_bid)
        db.session.commit()

        return jsonify(msg="Bid placed successfully", bid_id=new_bid.id), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": f"Error placing bid: {str(e)}"}), 500


# View all bids for a specific auction item
@bids_bp.route('/auction_item/<int:item_id>', methods=['GET'])
def view_bids_for_auction_item(item_id):
    auction_item = AuctionItem.query.get_or_404(item_id)
    
    # Check if auction is still active
    if auction_item.end_time and datetime.utcnow() > auction_item.end_time:
        return jsonify({"msg": "Auction has already ended"}), 400

    bids = Bid.query.filter_by(auction_item_id=item_id).all()

    if not bids:
        return jsonify({"msg": "No bids placed for this auction item"}), 404

    bid_list = [{
        "bid_id": bid.id,
        "amount": bid.amount,
        "bidder_id": bid.bidder_id,
        "timestamp": bid.timestamp
    } for bid in bids]

    return jsonify(bids=bid_list), 200


# View details of a specific bid
@bids_bp.route('/<int:bid_id>', methods=['GET'])
def view_specific_bid(bid_id):
    bid = Bid.query.get_or_404(bid_id)
    return jsonify({
        "bid_id": bid.id,
        "amount": bid.amount,
        "auction_item_id": bid.auction_item_id,
        "bidder_id": bid.bidder_id,
        "timestamp": bid.timestamp
    }), 200


# Delete a bid (user can only delete their own bid)
@bids_bp.route('/<int:bid_id>', methods=['DELETE'])
@jwt_required()
def delete_bid(bid_id):
    user_id = get_jwt_identity()
    bid = Bid.query.get_or_404(bid_id)

    # Ensure the user is the one who placed the bid
    if bid.bidder_id != user_id:
        return jsonify({"msg": "You are not authorized to delete this bid"}), 403

    try:
        db.session.delete(bid)
        db.session.commit()

        return jsonify(msg="Bid deleted successfully"), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": f"Error deleting bid: {str(e)}"}), 500
