import sys
import os

# Add the backend directory to sys.path so imports in main.py work
sys.path.append(os.path.join(os.path.dirname(__file__), '../backend'))

from backend.main import app
