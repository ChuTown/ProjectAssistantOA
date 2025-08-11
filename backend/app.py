from flask import Flask
from flask_cors import CORS
from flask_pymongo import PyMongo

app = Flask(__name__)
CORS(app)

@app.route('/hello')
def home():
    return 'Hello from Backend', 200

if __name__ == "__main__":
    app.run(debug=True)
