#!/bin/bash

# Navigate to project root (assuming script is in root)
cd "$(dirname "$0")"

# Activate virtual environment
if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
else
    echo "Virtual environment not found in venv/bin/activate"
    exit 1
fi

# Run uvicorn with host 0.0.0.0 to allow external access
echo "Starting Backend on 0.0.0.0:8000..."
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
