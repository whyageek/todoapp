from flask import request, jsonify
import requests
from config import Config

def keycloak_middleware(request):
    print("Request Headers:", request.headers) #chut
    
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        print("Authorization header is missing")
        return jsonify({"error": "Missing Authorization Header"}), 401

    token = auth_header.split(' ')[1]
    print("Token received:", token) #chut

    
    response = requests.get(
        f"{Config.KEYCLOAK_SERVER_URL}/realms/{Config.KEYCLOAK_REALM}/protocol/openid-connect/userinfo",
        headers={"Authorization": f"Bearer {token}"}
    )

    if response.status_code != 200:
        print("Keycloak Error Response:", response.text)  # chut
        return jsonify({"error": "Unauthorized: Invalid Token"}), 401
    

    user_info = response.json()

    if "aud" not in user_info or "todo-client" not in user_info["aud"]:
        print("Invalid audience:", user_info.get("aud")) #sabsebadichut
        return jsonify({"error": "Unauthorized: Invalid Audience"}), 401
    
    request.user = user_info

def require_pro_user(user):
    if not user.is_pro:
        raise Exception("Pro license required")
