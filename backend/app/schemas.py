from pydantic import BaseModel, Field, validator
from typing import List, Optional
from datetime import datetime
import re

class TodoBase(BaseModel):
    title: str
    description: Optional[str] = None
    completed: bool = False
    priority: str = "medium"
    category: str = ""
    due_date: Optional[datetime] = None
    order: int = 0

class TodoCreate(TodoBase):
    pass

class Todo(TodoBase):
    id: int
    owner_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class UserBase(BaseModel):
    username: str = Field(..., min_length=2, max_length=50)
    phone_number: Optional[str] = Field(None, pattern=r'^1[3-9]\d{9}$')
    
    @validator('username')
    def validate_username(cls, v):
        # 允许中文、英文、数字、下划线、连字符
        if not re.match(r'^[\u4e00-\u9fa5a-zA-Z0-9_-]+$', v):
            raise ValueError('用户名只能包含中文、英文、数字、下划线和连字符')
        return v

class UserCreate(UserBase):
    # 添加验证：最小长度6，最大长度72（bcrypt 限制）
    password: str = Field(..., min_length=6, max_length=72)
    # 注册时手机号必填（覆盖父类的可选设置）
    phone_number: str = Field(..., pattern=r'^1[3-9]\d{9}$')

class User(UserBase):
    id: int
    todos: List[Todo] = []

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
