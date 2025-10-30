# Microburbs Dashboard

## Getting Started

### Prerequisites

* Python 3.10+
* Node.js 18+
* npm

### Installation

1. Clone the repository
2. Install backend dependencies:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r backend/requirements.txt
   ```
3. Install frontend dependencies:
   ```bash
   npm install --prefix frontend
   ```

## Running the application

### Running concurrently

To run both the frontend and backend servers concurrently, run the following command from the root directory:

```bash
npm run dev:concurrent --prefix frontend
```

### Backend

1. Activate the virtual environment:
   ```bash
   source .venv/bin/activate
   ```
2. Start the backend server:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 --app-dir backend
   ```

### Frontend

1. Start the frontend server:
   ```bash
   npm run dev --prefix frontend
   ```

