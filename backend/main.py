from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
import shutil
import os
import tempfile
from pathlib import Path
from services.hf_service import get_hf_service
from sqlmodel import Session, select
from database import create_db_and_tables, get_session
from models import DetectionLog, User
from auth import get_password_hash, verify_password
from pydantic import BaseModel

app = FastAPI(title="Deepfake Detector API")

# CORS Configuration
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserCreate(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/")
def read_root():
    return {"message": "Deepfake Detector API is running"}

@app.post("/auth/register")
def register(user_data: UserCreate, session: Session = Depends(get_session)):
    # Check if user exists
    statement = select(User).where(User.email == user_data.email)
    existing_user = session.exec(statement).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    hashed_pwd = get_password_hash(user_data.password)
    new_user = User(email=user_data.email, password_hash=hashed_pwd)
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return {"message": "User created successfully", "user_id": new_user.id}

@app.post("/auth/login")
def login(user_data: UserLogin, session: Session = Depends(get_session)):
    statement = select(User).where(User.email == user_data.email)
    user = session.exec(statement).first()
    
    if not user or not verify_password(user_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    return {"message": "Login successful", "user_id": user.id, "email": user.email}

@app.get("/users")
def get_users(session: Session = Depends(get_session)):
    # Helper to see users (Dev Only)
    users = session.exec(select(User)).all()
    return [{"id": u.id, "email": u.email, "created_at": u.created_at} for u in users]

@app.post("/detect")
async def detect_image(file: UploadFile = File(...), session: Session = Depends(get_session)):
    """
    Receive uploaded image, save as temp file, and call Gradio service for prediction.
    """
    
    # 1. Validation
    if file.content_type not in ["image/jpeg", "image/png", "image/jpg", "image/webp"]:
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {file.content_type}")
    
    # 2. Save to temporary file
    suffix = Path(file.filename).suffix
    if not suffix:
        suffix = ".jpg" 
        
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name
        
    try:
        # 3. Call Service
        service = get_hf_service()
        result = service.predict(tmp_path)
        
        # 4. Log to Database
        log_entry = DetectionLog(
            filename=file.filename,
            raw_response=str(result) 
        )
        session.add(log_entry)
        session.commit()
        session.refresh(log_entry)
        
        return {
            "status": "success",
            "filename": file.filename,
            "prediction": result,
            "log_id": log_entry.id
        }
        
    except Exception as e:
        print(f"Error processing request: {e}")
        raise HTTPException(status_code=500, detail=str(e))
        
    finally:
        # 5. Cleanup
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
