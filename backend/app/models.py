from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), unique=True, index=True)
    hashed_password = Column(String(255))
    phone_number = Column(String(20), unique=True, index=True, nullable=True)

    todos = relationship("Todo", back_populates="owner")

class Todo(Base):
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True)
    description = Column(String(500), index=True)
    completed = Column(Boolean, default=False)
    
    # 新增字段
    priority = Column(String(20), default="medium")  # high, medium, low
    category = Column(String(50), default="default") # e.g., work, personal
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # 新增截止日期和排序字段
    due_date = Column(DateTime(timezone=True), nullable=True)
    order = Column(Integer, default=0)
    
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="todos")
