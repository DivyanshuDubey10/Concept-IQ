from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from openai import OpenAI
from typing import List

from backend.app.core.config import settings
from backend.app.core.security import get_current_user
from backend.app.database import get_db
from backend.app.models.user import User
from backend.app.models.chat import ChatSession, ChatMessage
from backend.app.schemas.tutor import (
    ChatRequest, 
    ChatResponse, 
    ChatSessionRead, 
    ChatMessageRead
)

router = APIRouter(prefix="/api/tutor", tags=["AI Tutor"])

# Initialize OpenAI client with NVIDIA base URL
client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key=settings.NVIDIA_API_KEY
)

@router.get("/sessions", response_model=List[ChatSessionRead])
def get_chat_sessions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Fetch all chat sessions for the current user."""
    sessions = db.query(ChatSession).filter(ChatSession.user_id == current_user.id).order_by(ChatSession.updated_at.desc()).all()
    return sessions

@router.get("/sessions/{session_id}/messages", response_model=List[ChatMessageRead])
def get_session_messages(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Fetch all messages for a specific chat session."""
    session = db.query(ChatSession).filter(ChatSession.id == session_id, ChatSession.user_id == current_user.id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    messages = db.query(ChatMessage).filter(ChatMessage.session_id == session_id).order_by(ChatMessage.created_at.asc()).all()
    return messages

@router.delete("/sessions/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_chat_session(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a specific chat session and all its messages."""
    session = db.query(ChatSession).filter(ChatSession.id == session_id, ChatSession.user_id == current_user.id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    db.delete(session)
    db.commit()
    return None

@router.post("/chat", response_model=ChatResponse)
def chat_with_tutor(
    payload: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Accepts a new message, saves it to the DB, fetches history, and gets AI response.
    """
    if not payload.messages:
        raise HTTPException(status_code=400, detail="No messages provided")
    
    latest_user_message = payload.messages[-1].content
    
    # 1. Manage Session
    session_id = payload.session_id
    if session_id:
        session = db.query(ChatSession).filter(ChatSession.id == session_id, ChatSession.user_id == current_user.id).first()
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
    else:
        # Create new session
        title = latest_user_message[:30] + "..." if len(latest_user_message) > 30 else latest_user_message
        session = ChatSession(user_id=current_user.id, title=title)
        db.add(session)
        db.commit()
        db.refresh(session)
        session_id = session.id
        
        # Add initial greeting as an assistant message since this is a new session
        greeting = ChatMessage(
            session_id=session_id,
            role="assistant",
            content=f"Hello {current_user.name.split(' ')[0]}! I'm your AI Tutor. I can help explain difficult concepts, provide practice problems, or guide you through your curriculum. What would you like to focus on today?"
        )
        db.add(greeting)
    
    # 2. Save User Message
    user_msg_db = ChatMessage(session_id=session_id, role="user", content=latest_user_message)
    db.add(user_msg_db)
    db.commit()

    # 3. Fetch Full Session History
    history = db.query(ChatMessage).filter(ChatMessage.session_id == session_id).order_by(ChatMessage.created_at.asc()).all()
    
    # 4. Prepare for OpenAI
    system_prompt = {
        "role": "system",
        "content": f"You are a helpful, patient, and personalized AI tutor. Your name is ConceptIQ Tutor. You are talking to a student named {current_user.name}. Keep your answers concise, encouraging, and easy to understand. Do not use overly complex vocabulary unless explaining a specific concept. Format output using beautiful Markdown."
    }
    
    api_messages = [system_prompt]
    for msg in history:
        api_messages.append({"role": msg.role, "content": msg.content})

    # 5. Get AI Response
    try:
        response = client.chat.completions.create(
            model="nvidia/nemotron-3.5-lightning-30b-a3b",
            messages=api_messages,
            temperature=0.7,
            max_tokens=1024,
            extra_body={
                "chat_template_kwargs": {
                    "enable_thinking": False
                }
            }
        )
        reply_content = response.choices[0].message.content
        
        # 6. Save AI Response
        ai_msg_db = ChatMessage(session_id=session_id, role="assistant", content=reply_content)
        db.add(ai_msg_db)
        db.commit()
        
        return ChatResponse(reply=reply_content, session_id=session_id)
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"AI Tutor service is currently unavailable: {str(e)}"
        )
