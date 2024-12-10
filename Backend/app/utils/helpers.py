from flask import jsonify

# ** General-purpose helper functions for common tasks like formatting responses or handling dates.

def format_response(data, message="Success", status_code=200):
    return jsonify({
        "status": status_code,
        "message": message,
        "data": data
    }), status_code

def calculate_percentage(part, whole):
    if whole == 0:
        return 0
    return (part / whole) * 100



