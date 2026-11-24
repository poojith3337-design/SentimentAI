# Intelligent Web Dashboard (React + Flask + MongoDB)

## Run locally
Terminal 1 (backend):
    cd backend
    python -m venv .venv
    .venv\Scripts\activate        (macOS/Linux: source .venv/bin/activate)
    python -m pip install -r requirements.txt
    flask --app app run --debug --port 5000

Terminal 2 (frontend):
    cd frontend
    npm install
    npm run dev                   (http://localhost:5173)

MongoDB must be running at mongodb://localhost:27017 (or edit backend/.env).
Or run Mongo + backend with: docker compose up --build

## API
GET /api/health | POST /api/sentiment {text} | POST /api/classify (multipart "image")
GET /api/predictions | GET /api/stats
(The image classifier is a placeholder; plug in a real model in backend/app.py.)

## Git
    git init && git branch -M main
    git add . && git commit -m "Initial project setup"
    git remote add origin https://github.com/<user>/<repo>.git
    git push -u origin main
