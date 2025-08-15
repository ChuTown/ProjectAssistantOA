from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash, check_password_hash
from pymongo.errors import DuplicateKeyError
from dotenv import load_dotenv
from pathlib import Path
import os

#hugging face imports
from faster_whisper import WhisperModel
import tempfile, uuid
import datetime

# load whisper model
whisper_model = WhisperModel("tiny", device="auto", compute_type="int8")

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

# get user's transcriptions
@app.get("/transcriptions/<username>")
def get_user_transcriptions(username):
    """
    Get all transcriptions for a specific user
    Returns: list of transcriptions with id, text, created_at, duration
    """
    username = username.strip().lower()
    
    #all transcriptions for this user
    transcriptions = list(db.transcripts.find(
        {"username": username}, 
        {"_id": 1, "text": 1, "duration": 1, "language": 1, "created_at": 1}
    ).sort("_id", -1))  # newest first
    
    # convert ObjectId to string for JSON serialization
    for trans in transcriptions:
        trans["id"] = str(trans["_id"])
        del trans["_id"]
    
    return {"transcriptions": transcriptions}, 200

# get specific transcription by ID
@app.get("/transcription/<transcription_id>")
def get_transcription(transcription_id):
    """
    Get a specific transcription by ID
    Returns: full transcription data including segments and words
    """
    from bson import ObjectId
    
    try:
        # find transcription by ID
        transcription = db.transcripts.find_one({"_id": ObjectId(transcription_id)})
        
        if not transcription:
            return {"error": "transcription not found"}, 404
        
        # convert ObjectId to string
        transcription["id"] = str(transcription["_id"])
        del transcription["_id"]
        
        return transcription, 200
        
    except Exception as e:
        return {"error": "invalid transcription ID"}, 400

# delete transcription by ID
@app.delete("/transcription/<transcription_id>")
def delete_transcription(transcription_id):
    """
    Delete a specific transcription by ID
    Returns: success message
    """
    from bson import ObjectId
    
    try:
        # find and delete transcription by ID
        result = db.transcripts.delete_one({"_id": ObjectId(transcription_id)})
        
        if result.deleted_count == 0:
            return {"error": "transcription not found"}, 404
        
        return {"message": "transcription deleted successfully"}, 200
        
    except Exception as e:
        return {"error": "invalid transcription ID"}, 400

@app.post("/transcribe")
def transcribe():
    """
    Accepts multipart/form-data with:
      - file: audio (wav/mp3/m4a/webm etc.)
      - username: optional, to associate transcript with a user
    Returns: { id, text, segments[], words[], language, duration }
    """
    if "file" not in request.files:
        return {"error": "no file uploaded"}, 400

    audio = request.files["file"]
    username = (request.form.get("username") or "").strip().lower()

    # save uploaded audio to a temp file
    with tempfile.NamedTemporaryFile(delete=False, suffix=f"_{uuid.uuid4().hex}.wav") as tmp:
        audio.save(tmp.name)
        tmp_path = tmp.name

    # transcribe with word-level timestamps
    segments, info = whisper_model.transcribe(
        tmp_path,
        task="transcribe",         # use "translate" to force English
        word_timestamps=True,      # word-level timing
        vad_filter=True,           # voice activity detection for cleaner segments
        vad_parameters={"min_silence_duration_ms": 500},
        beam_size=5
    )

    full_text = []
    seg_list = []
    word_list = []

    for seg in segments:
        full_text.append(seg.text)
        seg_list.append({
            "start": seg.start,
            "end": seg.end,
            "text": seg.text
        })
        if seg.words:
            for w in seg.words:
                word_list.append({
                    "word": w.word,
                    "start": w.start,
                    "end": w.end
                })

    transcript_text = "".join(full_text)

    # save to MongoDB (optional but matches your requirements)
    doc = {
        "username": username or None,
        "text": transcript_text,
        "segments": seg_list,
        "words": word_list,
        "language": getattr(info, "language", None),
        "duration": getattr(info, "duration", None),
        "created_at": datetime.datetime.utcnow()
    }
    res = db.transcripts.insert_one(doc)

    return {
        "id": str(res.inserted_id),
        "text": transcript_text,
        "segments": seg_list,
        "words": word_list,
        "language": getattr(info, "language", None),
        "duration": getattr(info, "duration", None)
    }, 200


# run app
if __name__ == "__main__":
    app.run(debug=True)
