# How to Run the Project

The DSA Visual Learning Platform is split into two components: a React/Vite Frontend and a Python FastAPI Backend. Both must be running simultaneously for the application to function properly.

## Prerequisites
- Node.js (v16+ recommended)
- Python (3.9+ recommended)

## 1. Running the Backend Server

The backend is responsible for storing algorithm metadata in a SQLite database and securely executing user-submitted Python code.

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd c:\Users\rosha\Downloads\dsa_platform\backend
   ```
2. Create and activate a virtual environment (if not already done):
   ```bash
   python -m venv venv
   .\venv\Scripts\activate
   ```
3. Install the dependencies (FastAPI, Uvicorn, SQLAlchemy, etc.):
   ```bash
   pip install fastapi uvicorn sqlalchemy pydantic
   ```
4. Start the Uvicorn server:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```
   *The backend will automatically create the SQLite database (`dsa_platform.db`) and seed it with the default algorithms if it doesn't exist.*

## 2. Running the Frontend Server

The frontend is a React Single Page Application powered by Vite.

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd c:\Users\rosha\Downloads\dsa_platform\frontend
   ```
2. Install the Node modules:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

## 3. Accessing the Platform

- **Application UI:** Open your browser and navigate to `http://localhost:5173`
- **Backend API Docs:** You can explore and test the API directly at `http://localhost:8000/docs`
