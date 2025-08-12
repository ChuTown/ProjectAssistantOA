from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash, check_password_hash
from pymongo.errors import DuplicateKeyError
from dotenv import load_dotenv
from pathlib import Path
import os

# load .env file
load_dotenv(Path(__file__).with_name('.env'))

app = Flask(__name__)
CORS(app)

# connect to mongo
uri = os.getenv("MONGO_URI")
if not uri:
    raise RuntimeError("MONGO_URI not set")
app.config["MONGO_URI"] = uri
mongo = PyMongo(app)
db = mongo.db

# make username unique
db.users.create_index("username", unique=True)

# test route
@app.get("/")
def health():
    return "Hello from Backend", 200

# sign up
@app.post("/signup")
def signup():
    # get data
    data = request.get_json(force=True)
    username = (data.get("username") or "").strip().lower()
    password = data.get("password")

    # check if empty
    if not username or not password:
        return {"error": "username and password required"}, 400

    # add to db
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

# log in
@app.post("/login")
def login():
    # get data
    data = request.get_json(force=True)
    username = (data.get("username") or "").strip().lower()
    password = data.get("password")

    # check if empty
    if not username or not password:
        return {"error": "username and password required"}, 400

    # find user
    user = db.users.find_one({"username": username})

    # check password
    if not user or not check_password_hash(user["password_hash"], password):
        return {"error": "invalid credentials"}, 401

    # ok
    return {"ok": True, "username": username}, 200

# run app
if __name__ == "__main__":
    app.run(debug=True)
