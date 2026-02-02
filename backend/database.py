from sqlmodel import SQLModel, create_engine, Session
from models import DetectionLog

import os

# Use /tmp for database on Vercel (read-only filesystem elsewhere) or local path
# We check for VERCEL or just use /tmp if not local
if os.environ.get("VERCEL"):
    sqlite_file_name = "/tmp/database.db" 
else:
    sqlite_file_name = "database.db"

sqlite_url = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, echo=True, connect_args=connect_args)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
