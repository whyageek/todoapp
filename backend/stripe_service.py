# stripe_service.py
import stripe
from flask import jsonify
from models import User
from config import Config
from models import db

stripe.api_key = Config.STRIPE_API_KEY

def setup_stripe_webhook(request):
    # Handle Stripe events here
    payload = request.get_data(as_text=True)
    sig_header = request.headers.get('Stripe-Signature')

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, Config.STRIPE_API_KEY)
        # Process event (e.g., handle subscription updates)
    except ValueError as e:
        return jsonify({"error": "Invalid payload"}), 400
    except stripe.error.SignatureVerificationError as e:
        return jsonify({"error": "Invalid signature"}), 400
    
    # Handle successful payment
    if event['type'] == 'charge.succeeded':
        handle_payment_success(event)

    return jsonify({"success": True})

def handle_payment_success(event):
    # Extract user data from event
    email = event['data']['object']['billing_details']['email']
    user = User.query.filter_by(email=email).first()
    if user:
        user.is_pro = True
        db.session.commit()



