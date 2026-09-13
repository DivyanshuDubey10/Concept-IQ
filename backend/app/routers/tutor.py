from fastapi import APIRouter, Depends, HTTPException, status
from openai import OpenAI
from backend.app.core.config import settings
from backend.app.core.security import get_current_user
from backend.app.models.user import User
from backend.app.schemas.tutor import ChatRequest, ChatResponse

router = APIRouter(prefix="/api/tutor", tags=["AI Tutor"])

# Initialize OpenAI client with NVIDIA base URL
client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key=settings.NVIDIA_API_KEY
)

@router.post("/chat", response_model=ChatResponse)
def chat_with_tutor(
    payload: ChatRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Accepts a list of previous chat messages and returns the AI Tutor's response.
    """
    
    # Prepend the system prompt
    system_prompt = {
        "role": "system",
        "content": f"You are a helpful, patient, and personalized AI tutor. Your name is ConceptIQ Tutor. You are talking to a student named {current_user.name}. Keep your answers concise, encouraging, and easy to understand. Do not use overly complex vocabulary unless explaining a specific concept."
    }
    
    # Convert Pydantic models to dicts for OpenAI
    api_messages = [system_prompt]
    for msg in payload.messages:
        api_messages.append({"role": msg.role, "content": msg.content})

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
        reply = response.choices[0].message.content
        return ChatResponse(reply=reply)
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"AI Tutor service is currently unavailable: {str(e)}"
        )
