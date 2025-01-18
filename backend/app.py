# app.py
from flask import Flask, request, app
from flask_graphql import GraphQLView
from models import db
from schema import schema
from config import Config
from auth import keycloak_middleware
from stripe_service import setup_stripe_webhook
from flask import send_from_directory
from werkzeug.middleware.proxy_fix import ProxyFix
from flask_cors import CORS

app = Flask(__name__)
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_port=1)
app.config['UPLOAD_FOLDER'] = 'uploads'
CORS(app, resources={r"/*": {"origins": "*"}})
app.config.from_object(Config)
db.init_app(app)


@app.before_request
def authenticate():
    auth_response = keycloak_middleware(request)
    if isinstance(auth_response, tuple):  # Middleware ki mkc
        return auth_response  # error response hai

app.add_url_rule('/graphql', view_func=GraphQLView.as_view(
    'graphql',
    schema=schema,
    graphiql=True,
    context={'user': lambda: getattr(request, 'user', None)}  # user context rand 
))

@app.route('/stripe-webhook', methods=['POST'])
def stripe_webhook():
    return setup_stripe_webhook(request)

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory('uploads', filename)



if __name__ == "__main__":
    app.run(debug=True)
