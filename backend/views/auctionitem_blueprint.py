from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from app import db, AuctionItem, UPLOAD_FOLDER  # replace 'yourapp' with your app module
from flask_jwt_extended import jwt_required, get_jwt_identity

# Define allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

auctionitem_bp = Blueprint('auctionitem', __name__)

@auctionitem_bp.route('/auctionitems/<int:auction_item_id>', methods=['PUT'])
@jwt_required()
def update_auction_item(auction_item_id):
    # Get the current user's ID from the JWT token
    current_user_id = get_jwt_identity()

    # Find the auction item
    auction_item = AuctionItem.query.get_or_404(auction_item_id)

    # Check if the current user is the seller
    if auction_item.seller_id != current_user_id:
        return jsonify({"error": "You are not authorized to update this auction item"}), 403

    # Get form data
    title = request.form.get('title')
    description = request.form.get('description')
    starting_price = request.form.get('starting_price')

    # Validate required fields
    if not title and not description and not starting_price and 'image' not in request.files:
        return jsonify({"error": "No data provided to update."}), 400

    # Update fields if provided
    if title:
        auction_item.title = title
    if description:
        auction_item.description = description
    if starting_price:
        try:
            auction_item.starting_price = float(starting_price)
        except ValueError:
            return jsonify({"error": "Starting price must be a valid number"}), 400

    # Handle file upload for image
    image_url = auction_item.image_url  # Keep the existing image unless a new one is uploaded
    if 'image' in request.files:
        file = request.files['image']
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.join(UPLOAD_FOLDER, filename)
            file.save(file_path)
            image_url = file_path
        else:
            return jsonify({"error": "Invalid file format. Allowed formats are: png, jpg, jpeg, gif."}), 400

    # Update image_url if a new image is provided
    auction_item.image_url = image_url

    # Commit the changes to the database
    try:
        db.session.commit()
        return jsonify({
            "message": "Auction item updated successfully", 
            "auction_item": {
                "id": auction_item.id,
                "title": auction_item.title,
                "description": auction_item.description,
                "starting_price": auction_item.starting_price,
                "image_url": auction_item.image_url,
                "seller_id": auction_item.seller_id
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"An error occurred while updating the auction item: {str(e)}"}), 500
