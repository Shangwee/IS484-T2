from flask import Flask

def create_app():
    app = Flask(__name__)
    
    @app.route('/health')
    def health_check():
        return {"status": "ok"}, 200
    
    return app

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
