from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from flask import jsonify

# ** Contains custom decorators for functions or routes, such as authentication and validation.

def jwt_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            verify_jwt_in_request()
        except Exception as e:
            return jsonify({"message": "Unauthorized"}), 401
        return fn(*args, **kwargs)
    return wrapper
