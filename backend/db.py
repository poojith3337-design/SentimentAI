import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()
client = MongoClient(os.getenv("MONGO_URI", "mongodb://localhost:27017"),
                     serverSelectionTimeoutMS=3000)
db = client[os.getenv("DB_NAME", "ai_fullstack")]
predictions = db["predictions"]
