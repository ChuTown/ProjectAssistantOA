from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash, check_password_hash
from pymongo.errors import DuplicateKeyError
from bson.objectid import ObjectId
from dotenv import load_dotenv
import os


app = Flask(__name__)
CORS(app)

@app.route('/hello')
def home():
    return 'Hello from Backend', 200

app.config["MONGO_URI"] = os.getenv("MONGO_URI")
mongo = PyMongo(app)
db = mongo.db

db.users.create_index("username", unique=True)

@app.post("/signup")
def signup():

    #read request data
    data = request.get_json(force=True)
    username = (data.get("username") or "").strip().lower()
    password = data.get("password")

    #if username or password is empty, return error
    if not username or not password:
        return {"error": "username and password required"}, 400

    #create user in database
    try:
        res = db.users.insert_one({
            "username": username,
            "password_hash": generate_password_hash(password)
        })
        return {"id": str(res.inserted_id), "username": username}, 201

    except DuplicateKeyError:
        return {"error": "username already taken"}, 409

    except Exception:
        return {"error": "server error"}, 500
    
def login():
    data = request.get_json(force=True)
    username = (data.get("username") or "").strip().lower()
    password = data.get("password")

    if not username or not password:
        return {"error": "username and password required"}, 400

    #look up user
    user = db.users.find_one({"username": username})

    #check password
    if not user or not check_password_hash(user["password_hash"],password):
        return {"error:" "invalid password"}, 401
    
    #logged in
    return {"ok": True, "username":username}, 200

if __name__ == "__main__":
    app.run(debug=True)
