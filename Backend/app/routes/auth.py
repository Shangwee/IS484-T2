from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from werkzeug.security import generate_password_hash, check_password_hash
from app.models.user import User
from app.utils.helpers import format_response
from app import db

auth_bp = Blueprint('auth', __name__)

# Blacklist set to store JWT tokens
blacklist = set()

# ** User Registration
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return format_response (None, "Username, email, and password are required", 400)
    if User.query.filter_by(email=email).first():
        return format_response (None, "Email already exists", 400)

    hashed_password = generate_password_hash(password, method='sha256')

    # Debugging
    print ("====================")
    print("Username: ", username)
    print("Original Password: ", password)
    print("Hashed Password: ", hashed_password)
    print ("====================")
    
    new_user = User(username=username, email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return format_response (None, "User created successfully", 201)

# ** User Login
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return format_response(None, "Email and password are required", 400)

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        return format_response(None, "Invalid email or password", 401)

    access_token = create_access_token(identity={"id": user.id, "username": user.username})
    return format_response({"access_token": access_token}, "Login successful", 200)

# ** Protected Route (Example)
@auth_bp.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return format_response(current_user, f"Hello, {current_user['username']}!", 200)

# User Logout (Optional if using client-side token management)
@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    # Blacklist the current access token
    jti = get_jwt()['jti']
    blacklist.add(jti)

    return format_response(None, "Logged out successfully", 200)
