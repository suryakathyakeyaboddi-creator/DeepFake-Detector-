from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional

class DetectionLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    filename: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    result_label: Optional[str] = None # e.g. "real" or "fake"
    confidence_score: Optional[float] = None
    raw_response: str # JSON string of full response

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True)
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
