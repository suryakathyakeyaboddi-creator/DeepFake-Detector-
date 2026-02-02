import sys
import os

# Set cache dirs to /tmp for read-only filesystem on Vercel
os.environ['HF_HOME'] = '/tmp/hf_home'
os.environ['GRADIO_TEMP_DIR'] = '/tmp/gradio_temp'

# Add the backend directory to sys.path so imports in main.py work
sys.path.append(os.path.join(os.path.dirname(__file__), '../backend'))

from main import app
