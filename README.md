# SentimentAI – AI-Powered Sentiment Analysis and Analytics Dashboard

<p align="center">

  **An Intelligent Full-Stack Application for Sentiment Analysis**

  A web-based application that analyzes text, identifies emotional tone, classifies sentiment, stores prediction history, and displays analytical insights through an interactive dashboard.

</p>

---

# 1. Introduction

SentimentAI is a full-stack web application developed to analyze the sentiment of textual information using Natural Language Processing (NLP).

In today's digital world, people share their opinions, feedback, experiences, and reviews through social media platforms, websites, online shopping applications, and other digital communication channels.

Manually reading and understanding thousands of comments or reviews is time-consuming. Businesses and organizations need a faster way to understand whether people have positive, negative, or neutral opinions about their products and services.

SentimentAI addresses this problem by automatically analyzing text and classifying it into three sentiment categories:

- **Positive:** The text expresses satisfaction, happiness, appreciation, or a favorable opinion.
- **Negative:** The text expresses dissatisfaction, disappointment, criticism, or an unfavorable opinion.
- **Neutral:** The text expresses information or an opinion without a clearly positive or negative tone.

The application uses a React frontend, Python Flask backend, VADER sentiment analysis, and MongoDB database to provide an interactive sentiment analysis experience.

It also includes a dashboard that displays sentiment statistics, recent predictions, and a confusion matrix for evaluating predictions when actual sentiment labels are available.

# 2. Problem Statement

The increasing use of digital platforms has created a huge amount of textual data in the form of customer reviews, feedback, comments, and opinions.

Analyzing this information manually creates several challenges:

1. It requires considerable time and human effort.
2. Large amounts of feedback are difficult to process manually.
3. Understanding customer satisfaction becomes challenging.
4. Identifying negative feedback quickly is difficult.
5. Maintaining prediction history and analyzing trends requires additional effort.

Therefore, an automated sentiment analysis system is required to process text, identify sentiment categories, store results, and present useful analytical information.

SentimentAI provides a web-based solution to these challenges.

# 3. Project Objectives

The main objectives of SentimentAI are:

1. To develop a user-friendly sentiment analysis application.
2. To analyze textual information using Natural Language Processing.
3. To classify text into positive, negative, and neutral categories.
4. To generate sentiment scores for analyzed text.
5. To store prediction records in a MongoDB database.
6. To display sentiment statistics through an interactive dashboard.
7. To maintain a history of previous predictions.
8. To allow users to enter actual sentiment labels for evaluation.
9. To generate a confusion matrix using verified prediction records.
10. To demonstrate the practical implementation of frontend, backend, database, and machine learning libraries in one application.

# 4. Technologies Used

The project uses several technologies that work together to create a complete full-stack application.

## 4.1 Frontend Technologies

### React.js

React.js is a JavaScript library used to develop the user interface.

In SentimentAI, React is responsible for displaying the dashboard, handling user interactions, requesting information from the backend, and updating the interface when new data is received.

Main responsibilities:

- Displaying the dashboard.
- Accepting user input.
- Showing sentiment predictions.
- Displaying charts and statistics.
- Showing prediction history.
- Displaying the confusion matrix.

### JavaScript

JavaScript manages the application logic on the frontend.

It handles API requests, user interactions, component states, and dynamic dashboard updates.

### CSS

CSS is used to design the application's appearance.

It controls:

- Dashboard layout.
- Colors and backgrounds.
- Cards and tables.
- Typography.
- Spacing and alignment.
- Responsive interface elements.

The project uses a premium dark dashboard design to create a modern analytics interface.

### Axios

Axios is used to communicate with the Flask backend through HTTP requests.

For example, the frontend sends text to the sentiment API and receives the predicted sentiment as a response.

## 4.2 Backend Technologies

### Python

Python is the primary programming language used to develop the backend.

It handles sentiment processing, API functionality, database operations, and evaluation calculations.

### Flask

Flask is a lightweight Python web framework.

In this project, Flask provides the API endpoints that connect the React frontend with the backend functionality.

The backend runs locally at:

`http://127.0.0.1:5000`

### VADER Sentiment Analyzer

VADER stands for Valence Aware Dictionary and sEntiment Reasoner.

It is a rule-based sentiment analysis tool designed to analyze the sentiment of text.

It considers:

- Positive and negative words.
- Word intensity.
- Punctuation.
- Capitalization.
- Certain linguistic patterns.

VADER generates a compound sentiment score between -1 and +1.

The project uses this score to determine the sentiment category.

The backend also contains a fallback keyword-based sentiment analysis method if the VADER analyzer is unavailable.

### Scikit-learn

Scikit-learn is a Python machine learning library.

In SentimentAI, it is used for evaluating predictions.

The project uses:

- Confusion matrix.
- Accuracy score.
- Precision score.
- Recall score.
- F1-score.

These evaluation metrics help measure how closely predictions match user-provided actual sentiment labels.

### Pillow

Pillow is a Python image-processing library.

The backend uses it to open uploaded images and calculate image-related information.

The current image classification endpoint uses image brightness as a demonstration-based placeholder rather than a trained image recognition model.

## 4.3 Database Technology

### MongoDB

MongoDB is a NoSQL database that stores information in document format.

SentimentAI uses MongoDB to store prediction records.

A prediction record can contain:

- Prediction ID.
- Input text or image information.
- Predicted sentiment label.
- Sentiment score.
- Prediction type.
- Creation date and time.
- Actual sentiment label, when provided.

MongoDB allows the application to retrieve previous predictions and calculate dashboard statistics.

## 4.4 Development Tools

- Visual Studio Code – Code editor.
- Windows PowerShell – Running development commands.
- Git – Version control.
- GitHub – Source code hosting.
- Web browser – Testing the application.

# 5. System Architecture

SentimentAI follows a full-stack architecture consisting of three main layers:

1. Presentation layer – React frontend.
2. Application layer – Python Flask backend.
3. Data layer – MongoDB database.

## Architecture Overview

```text
             USER
               |
               |
               v
      REACT FRONTEND
       (Dashboard UI)
               |
               |
          Axios API
               |
               v
       PYTHON FLASK API
               |
       +-------+--------+
       |       |        |
       v       v        v
    VADER   Evaluation  Image
   Analysis  Metrics   Processing
       |       |        |
       +-------+--------+
               |
               v
           MONGODB
         Database
               |
               v
       Stored Predictions
               |
               v
       Dashboard Analytics
```

## How the Architecture Works

**Step 1: User Interaction**

The user opens the SentimentAI dashboard and enters text for sentiment analysis.

**Step 2: Frontend Processing**

The React frontend collects the text and sends an HTTP request to the Flask backend using Axios.

**Step 3: Backend Processing**

Flask receives the request and passes the text to the sentiment analysis function.

**Step 4: Sentiment Classification**

VADER analyzes the text and calculates a compound sentiment score.

**Step 5: Sentiment Result**

The backend determines whether the sentiment is positive, negative, or neutral.

**Step 6: Database Storage**

The prediction result is saved in MongoDB along with its timestamp and other relevant information.

**Step 7: API Response**

Flask sends the prediction result back to React in JSON format.

**Step 8: Dashboard Display**

React displays the result and updates the relevant dashboard information.

# 6. Working Principle of SentimentAI

The sentiment analysis process follows a sequence of operations.

## 6.1 Input Collection

The application accepts text entered by the user.

Example:

"I really love this application. It is easy to use and very helpful."

## 6.2 Text Analysis

The backend passes the input to VADER.

VADER evaluates the words and their context to estimate the sentiment.

## 6.3 Compound Score

VADER produces a compound score between -1 and +1.

The score represents the overall sentiment polarity.

General interpretation:

| Compound score | Interpretation |
|---|---|
| Greater than or equal to +0.05 | Positive |
| Between -0.05 and +0.05 | Neutral |
| Less than or equal to -0.05 | Negative |

These are the standard VADER compound-score thresholds.

## 6.4 Sentiment Classification

Based on the compound score, the backend assigns a sentiment label.

Example:

Input: "This product is excellent."

Possible classification: Positive.

Input: "This product is terrible."

Possible classification: Negative.

Input: "The product arrived today."

Possible classification: Neutral.

The actual result depends on the complete text and its context.

## 6.5 Saving the Result

After analysis, the application saves the prediction in MongoDB.

The saved record can be used for prediction history and dashboard analytics.

# 7. Main Features of the Project

## 7.1 Sentiment Analysis

The main feature allows users to enter text and analyze its sentiment.

The system classifies the text into positive, negative, or neutral categories.

## 7.2 Sentiment Score

The application returns a numerical sentiment score generated by the analysis process.

This score helps users understand the estimated polarity of the text.

## 7.3 Analytics Dashboard

The dashboard presents important information about the application's prediction records.

It can display:

- Total predictions.
- Positive predictions.
- Negative predictions.
- Neutral predictions.
- Average sentiment score.
- Sentiment distribution.
- Recent analysis records.

## 7.4 Prediction History

The application stores previous prediction records in MongoDB.

The frontend retrieves these records through the predictions API.

This helps users review earlier analyses.

## 7.5 Confusion Matrix

The confusion matrix is used to evaluate sentiment classification results.

It compares predicted sentiment labels with actual sentiment labels entered by the user.

For example, it can help identify:

- Correct positive predictions.
- Correct negative predictions.
- Correct neutral predictions.
- Positive texts predicted as negative.
- Negative texts predicted as neutral.

The matrix is generated only from records that have valid actual sentiment labels.

## 7.6 Performance Evaluation

The project uses several evaluation metrics.

**Accuracy**

Measures the proportion of correct predictions among all evaluated predictions.

**Precision**

Measures how many predictions assigned to a particular class were correct.

**Recall**

Measures how many actual examples of a particular class were correctly identified.

**F1-score**

Combines precision and recall into a single metric using their harmonic mean.

The application calculates macro-averaged precision, recall, and F1-score across the three sentiment classes.

These metrics are meaningful only when actual labels have been entered.

## 7.7 Image Upload Demonstration

The backend also contains an image upload endpoint.

It validates uploaded JPEG and PNG images and processes image brightness.

Important: This is currently a demonstration feature, not a trained AI image classification system.

# 8. Backend API Documentation

The Flask backend provides the following API endpoints.

Base URL:

`http://127.0.0.1:5000`

## 8.1 Health Check API

Endpoint:

`GET /api/health`

Purpose:

Checks whether the backend application is running.

## 8.2 Sentiment Analysis API

Endpoint:

`POST /api/sentiment`

Purpose:

Accepts text and returns its predicted sentiment.

Example request:

```json
{
  "text": "I love this application"
}
```

The response includes information such as:

- Predicted sentiment.
- Sentiment score.
- Original text.
- Prediction ID.

## 8.3 Prediction History API

Endpoint:

`GET /api/predictions`

Purpose:

Retrieves recent prediction records stored in MongoDB.

The backend returns up to the latest 50 records.

## 8.4 Statistics API

Endpoint:

`GET /api/stats`

Purpose:

Provides dashboard statistics, including total records, sentiment counts, recent scores, and average score.

## 8.5 Confusion Matrix API

Endpoint:

`GET /api/confusion-matrix`

Purpose:

Calculates evaluation metrics using records that contain both a predicted sentiment and a valid actual sentiment.

The response includes:

- Labels.
- Confusion matrix values.
- Total evaluated records.
- Accuracy.
- Precision.
- Recall.
- F1-score.

## 8.6 Actual Sentiment Verification API

Endpoint:

`POST /api/predictions/{prediction_id}/actual`

Purpose:

Allows an actual sentiment label to be associated with an existing prediction.

Example request:

```json
{
  "actual_sentiment": "positive"
}
```

The accepted labels are:

- positive
- neutral
- negative

The verified records can then be used to evaluate model predictions.

## 8.7 Image Classification API

Endpoint:

`POST /api/classify`

Purpose:

Accepts an uploaded image and processes it through the current image demonstration functionality.

Supported image formats:

- JPEG
- PNG

The backend also enforces a maximum upload size of 5 MB.

# 9. Database Design

MongoDB stores the prediction information used by the application.

A typical sentiment prediction document has the following conceptual structure:

```json
{
  "_id": "MongoDB-generated-id",
  "type": "sentiment",
  "text": "I love this application",
  "label": "positive",
  "score": 0.75,
  "created_at": "2026-11-24T10:00:00Z",
  "actual_sentiment": "positive"
}
```

The example is illustrative. Actual field values depend on the prediction and database implementation.

## Database Operations

The application performs the following operations:

1. Insert new prediction records.
2. Retrieve recent predictions.
3. Update records with actual sentiment labels.
4. Group records by sentiment category.
5. Calculate statistics.
6. Retrieve records for confusion matrix evaluation.

# 10. Project Folder Structure

The project is organized into frontend and backend folders.

```text
fullstack-ai-app/
│
├── backend/
│   │
│   ├── app.py
│   ├── db.py
│   ├── requirements.txt
│   ├── .env
│   │
│   └── Other Python files
│
├── frontend/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── StatCard.jsx
│   │   │   ├── ChartPanel.jsx
│   │   │   ├── ConfusionMatrix.jsx
│   │   │   └── ConfusionMatrix.css
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── Dashboard.jsx
│   │   └── Other frontend files
│   │
│   ├── package.json
│   └── Other frontend configuration files
│
├── .gitignore
└── README.md
```

The structure above describes the main project organization. Your actual folder names and additional files may differ.

# 11. Installation and Setup Guide

Follow these instructions to run SentimentAI on a Windows computer.

## Prerequisites

Install the following software:

1. Python.
2. Node.js and npm.
3. MongoDB or a supported MongoDB connection.
4. Git.
5. Visual Studio Code.

## Step 1: Clone the GitHub Repository

Open PowerShell and execute:

```powershell
git clone https://github.com/poojith3337-design/SentimentAI.git
```

Navigate into the project:

```powershell
cd SentimentAI
```

## Step 2: Set Up the Backend

Navigate to the backend folder:

```powershell
cd backend
```

Create a Python virtual environment:

```powershell
python -m venv venv
```

Activate it:

```powershell
.\venv\Scripts\Activate.ps1
```

Install the backend requirements:

```powershell
python -m pip install -r requirements.txt
```

Configure your MongoDB environment variables in a local `.env` file according to the variable names expected by `db.py`.

Do not upload this file to GitHub.

Start the Flask application:

```powershell
python app.py
```

The backend should run at:

`http://127.0.0.1:5000`

## Step 3: Set Up the Frontend

Open a second terminal.

Navigate to the frontend folder:

```powershell
cd frontend
```

Install frontend dependencies:

```powershell
npm install
```

Start the React development server:

```powershell
npm run dev
```

The frontend will normally be available at:

`http://localhost:5173`

## Step 4: Open the Application

Open your browser and visit:

`http://localhost:5173`

The React dashboard should connect to the Flask backend.

Make sure your frontend API configuration points to the correct backend URL.

# 12. Testing the Application

The following tests can be used to verify the application.

| Test | Expected result |
|---|---|
| Open dashboard | Dashboard loads |
| Submit positive text | Positive sentiment result |
| Submit negative text | Negative sentiment result |
| Submit neutral text | Neutral sentiment result |
| View prediction history | Recent records appear |
| Check statistics | Dashboard metrics appear |
| Add actual sentiment | Prediction record is updated |
| Open confusion matrix | Evaluation results appear when verified records exist |
| Upload supported image | Image endpoint processes the image |

The exact result of sentiment analysis depends on the text being analyzed.

# 13. Advantages of SentimentAI

1. Reduces the effort required for basic sentiment classification.
2. Provides quick text analysis.
3. Stores prediction history.
4. Offers a centralized analytics dashboard.
5. Uses an easy-to-understand sentiment classification system.
6. Supports evaluation using actual sentiment labels.
7. Demonstrates full-stack application development.
8. Uses widely adopted open-source technologies.
9. Can be extended with more advanced NLP models.

# 14. Limitations

Every software project has limitations.

The current version of SentimentAI has the following limitations:

1. VADER is a rule-based sentiment analyzer and may not understand every complex sentence.
2. Sarcasm and context-dependent expressions can be difficult to classify.
3. Sentiment accuracy depends on the quality and language of the input.
4. The confusion matrix requires actual sentiment labels for meaningful evaluation.
5. The current image-processing endpoint uses brightness-based demonstration logic, not a trained image recognition model.
6. The application is currently configured as a local development project.
7. A production deployment would require additional security, monitoring, and configuration.

# 15. Future Enhancements

SentimentAI can be improved in several ways.

### Advanced NLP Models

Integrate more advanced models such as:

- BERT.
- DistilBERT.
- RoBERTa.
- Other transformer-based sentiment classifiers.

### Multilingual Sentiment Analysis

Extend the system to analyze text in multiple languages.

### Social Media Integration

Allow analysis of publicly available social media comments and feedback through authorized APIs.

### Advanced Analytics

Add:

- Sentiment trend analysis.
- Date-wise reports.
- Downloadable PDF reports.
- More detailed visualizations.

### Improved Image Classification

Replace the current brightness-based demonstration with a properly trained image classification model if image recognition is required.

### Deployment

Deploy the frontend and backend to cloud hosting platforms so users can access the application online.

### Authentication

Add secure user registration and login functionality to support individual user accounts.

# 16. Conclusion

SentimentAI demonstrates how Natural Language Processing, web development, database management, and data analytics can be combined to create a useful full-stack application.

The project provides an automated way to analyze textual sentiment and classify it into positive, negative, and neutral categories.

The React frontend offers an interactive dashboard, while the Flask backend handles sentiment processing and API communication. MongoDB stores prediction records, and Scikit-learn provides evaluation metrics for verified predictions.

Through this project, important practical concepts such as REST APIs, frontend-backend communication, database integration, sentiment analysis, data visualization, and model evaluation are demonstrated.

SentimentAI can serve as a foundation for developing more advanced sentiment analysis applications in the future.

# 17. Author and Repository

**Project Name:** SentimentAI

**GitHub Username:** poojith3337-design

**GitHub Repository:** https://github.com/poojith3337-design/SentimentAI

**Project Type:** Full-Stack AI / NLP Application

**Purpose:** Educational and academic project

---

<p align="center">

  **SentimentAI – Turning Text into Insights**

  Developed as a practical demonstration of AI-powered sentiment analysis and full-stack web development.

</p>