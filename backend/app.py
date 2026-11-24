
import os
from datetime import datetime, timezone

from flask import Flask, jsonify, request
from flask_cors import CORS
from PIL import Image, ImageStat, UnidentifiedImageError
from pymongo.errors import PyMongoError
from bson import ObjectId
from bson.errors import InvalidId

from sklearn.metrics import (
    confusion_matrix,
    accuracy_score,
    precision_score,
    recall_score,
    f1_score
)

from db import predictions


app = Flask(__name__)

# --------------------------------
# CONFIGURATION
# --------------------------------

CORS(
    app,
    origins=[
        os.getenv(
            "FRONTEND_ORIGIN",
            "http://localhost:5173"
        )
    ]
)

app.config["MAX_CONTENT_LENGTH"] = 5 * 1024 * 1024

SENTIMENT_LABELS = ["positive", "neutral", "negative"]


# --------------------------------
# LOAD VADER
# --------------------------------

try:
    from vaderSentiment.vaderSentiment import (
        SentimentIntensityAnalyzer
    )

    vader = SentimentIntensityAnalyzer()

except ImportError:
    vader = None


# --------------------------------
# SENTIMENT ANALYSIS
# --------------------------------

def analyze_sentiment(text):

    if vader:
        score = vader.polarity_scores(text)["compound"]

        if score >= 0.05:
            label = "positive"

        elif score <= -0.05:
            label = "negative"

        else:
            label = "neutral"

        return label, round(abs(score), 2)

    words = text.lower().split()

    positive_words = [
        "good", "great", "excellent",
        "happy", "love", "wonderful"
    ]

    negative_words = [
        "bad", "terrible", "sad",
        "hate", "poor", "worst"
    ]

    positive_count = sum(
        word in positive_words for word in words
    )

    negative_count = sum(
        word in negative_words for word in words
    )

    if positive_count > negative_count:
        return "positive", 0.7

    elif negative_count > positive_count:
        return "negative", 0.7

    return "neutral", 0.5


# --------------------------------
# SAVE PREDICTION TO MONGODB
# --------------------------------

def save_prediction(data):

    try:
        result = predictions.insert_one({
            **data,
            "created_at": datetime.now(timezone.utc)
        })

        return str(result.inserted_id)

    except PyMongoError as error:
        app.logger.error(
            "MongoDB insert error: %s", error
        )

        return None


# --------------------------------
# HEALTH CHECK
# --------------------------------

@app.get("/api/health")
def health():

    return jsonify({
        "status": "ok",
        "message": "SentimentAI Flask API is running"
    })


# --------------------------------
# SENTIMENT API
# --------------------------------

@app.post("/api/sentiment")
def sentiment():

    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "error": "Invalid JSON request"
        }), 400

    text = data.get("text")

    if not isinstance(text, str) or not text.strip():
        return jsonify({
            "error": "Text is required"
        }), 400

    text = text.strip()

    if len(text) > 10000:
        return jsonify({
            "error": "Text must be under 10000 characters"
        }), 400

    label, score = analyze_sentiment(text)

    prediction_id = save_prediction({
        "type": "sentiment",
        "text": text,
        "label": label,
        "score": score
    })

    response = {
        "label": label,
        "score": score,
        "text": text,
        "prediction_id": prediction_id
    }

    if prediction_id is None:
        response["warning"] = "Prediction was not saved to MongoDB"

    return jsonify(response)


# --------------------------------
# IMAGE CLASSIFICATION API
# --------------------------------

@app.post("/api/classify")
def classify():

    file = request.files.get("image")

    if not file:
        return jsonify({
            "error": "Image is required"
        }), 400

    try:
        image = Image.open(file.stream)

        if image.format not in ("JPEG", "PNG"):
            return jsonify({
                "error": "Only JPEG and PNG images are allowed"
            }), 400

        image.verify()

        file.stream.seek(0)

        image = Image.open(file.stream)
        image = image.convert("RGB")
        image = image.resize((224, 224))

    except (
        UnidentifiedImageError,
        OSError,
        ValueError
    ):
        return jsonify({
            "error": "Invalid or corrupt image"
        }), 400

    # Placeholder image classification.
    # This is not a trained image recognition model.

    brightness = ImageStat.Stat(
        image.convert("L")
    ).mean[0]

    if brightness > 127:
        label = "bright-image"
    else:
        label = "dark-image"

    confidence = round(
        abs(brightness - 127) / 127,
        2
    )

    prediction_id = save_prediction({
        "type": "image",
        "text": "image upload",
        "label": label,
        "score": confidence
    })

    return jsonify({
        "label": label,
        "confidence": confidence,
        "prediction_id": prediction_id
    })


# --------------------------------
# SAVE ACTUAL SENTIMENT
# --------------------------------

@app.post("/api/predictions/<prediction_id>/actual")
def save_actual_sentiment(prediction_id):

    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "error": "Invalid JSON request"
        }), 400

    actual = data.get("actual_sentiment")

    if not isinstance(actual, str):
        return jsonify({
            "error": "Actual sentiment is required"
        }), 400

    actual = actual.strip().lower()

    if actual not in SENTIMENT_LABELS:
        return jsonify({
            "error": "Choose positive, neutral or negative"
        }), 400

    try:
        result = predictions.update_one(
            {
                "_id": ObjectId(prediction_id),
                "type": "sentiment"
            },
            {
                "$set": {
                    "actual_sentiment": actual
                }
            }
        )

        if result.matched_count == 0:
            return jsonify({
                "error": "Prediction record not found"
            }), 404

        return jsonify({
            "message": "Actual sentiment saved successfully",
            "actual_sentiment": actual
        })

    except InvalidId:
        return jsonify({
            "error": "Invalid prediction ID"
        }), 400

    except PyMongoError as error:
        app.logger.error(
            "MongoDB update error: %s", error
        )

        return jsonify({
            "error": "Database unavailable"
        }), 503


# --------------------------------
# GET PREDICTION HISTORY
# --------------------------------

@app.get("/api/predictions")
def list_predictions():

    try:
        items = list(
            predictions.find({}).sort(
                "created_at", -1
            ).limit(50)
        )

        for item in items:

            item["_id"] = str(item["_id"])

            if item.get("created_at"):
                item["created_at"] = (
                    item["created_at"].isoformat()
                )

        return jsonify(items)

    except PyMongoError as error:
        app.logger.error(
            "MongoDB history error: %s", error
        )

        return jsonify({
            "error": "Database unavailable"
        }), 503


# --------------------------------
# CONFUSION MATRIX API
# --------------------------------

@app.get("/api/confusion-matrix")
def get_confusion_matrix():

    try:
        records = list(
            predictions.find({
                "type": "sentiment",
                "actual_sentiment": {
                    "$in": SENTIMENT_LABELS
                },
                "label": {
                    "$in": SENTIMENT_LABELS
                }
            })
        )

        if not records:
            return jsonify({
                "labels": SENTIMENT_LABELS,
                "matrix": [
                    [0, 0, 0],
                    [0, 0, 0],
                    [0, 0, 0]
                ],
                "total_records": 0,
                "accuracy": 0,
                "precision": 0,
                "recall": 0,
                "f1_score": 0
            })

        y_true = [
            record["actual_sentiment"]
            for record in records
        ]

        y_pred = [
            record["label"]
            for record in records
        ]

        cm = confusion_matrix(
            y_true,
            y_pred,
            labels=SENTIMENT_LABELS
        )

        return jsonify({
            "labels": SENTIMENT_LABELS,
            "matrix": cm.tolist(),
            "total_records": len(records),

            "accuracy": round(
                accuracy_score(y_true, y_pred) * 100, 2
            ),

            "precision": round(
                precision_score(
                    y_true,
                    y_pred,
                    labels=SENTIMENT_LABELS,
                    average="macro",
                    zero_division=0
                ) * 100, 2
            ),

            "recall": round(
                recall_score(
                    y_true,
                    y_pred,
                    labels=SENTIMENT_LABELS,
                    average="macro",
                    zero_division=0
                ) * 100, 2
            ),

            "f1_score": round(
                f1_score(
                    y_true,
                    y_pred,
                    labels=SENTIMENT_LABELS,
                    average="macro",
                    zero_division=0
                ) * 100, 2
            )
        })

    except PyMongoError as error:
        app.logger.error(
            "Confusion matrix database error: %s", error
        )

        return jsonify({
            "error": "Database unavailable"
        }), 503


# --------------------------------
# DASHBOARD STATISTICS
# --------------------------------

@app.get("/api/stats")
def stats():

    try:
        groups = list(
            predictions.aggregate([
                {
                    "$group": {
                        "_id": "$label",
                        "n": {"$sum": 1}
                    }
                }
            ])
        )

        recent = [
            item.get("score", 0)
            for item in predictions.find(
                {},
                {"score": 1, "_id": 0}
            ).sort(
                "created_at", -1
            ).limit(10)
        ]

        total = sum(
            group["n"] for group in groups
        )

        recent.reverse()

        average = (
            sum(recent) / len(recent)
            if recent else 0
        )

        return jsonify({
            "labels": [
                group["_id"] for group in groups
            ],
            "counts": [
                group["n"] for group in groups
            ],
            "total": total,
            "runs": recent,
            "avg_score": round(average, 2)
        })

    except PyMongoError as error:
        app.logger.error(
            "MongoDB statistics error: %s", error
        )

        return jsonify({
            "error": "Database unavailable"
        }), 503


# --------------------------------
# ERROR HANDLERS
# --------------------------------

@app.errorhandler(413)
def too_large(error):

    return jsonify({
        "error": "File too large. Maximum size is 5 MB."
    }), 413


@app.errorhandler(500)
def server_error(error):

    app.logger.exception(
        "Internal server error"
    )

    return jsonify({
        "error": "Internal server error"
    }), 500


# --------------------------------
# RUN APPLICATION
# --------------------------------

if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=False
    )