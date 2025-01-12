import json
from functools import lru_cache
from typing import List, Optional

import anthropic
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from models import CallItem, CallModel, AnswerRequest, AnswerResponse

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/calls/", response_model=List[CallItem])
def get_calls() -> List[CallItem]:
    return [
        CallItem(
            call_id=call["id"],
            created_date=call["created_at_utc"],
            title=call["call_metadata"]["title"],
        )
        for call in load_call_data()
    ]


@app.get("/calls/{call_id}", response_model=CallModel)
def get_call_details(call_id: str) -> CallModel:
    call_dict = get_call_by_id(call_id)

    if not call_dict:
        raise HTTPException(status_code=404, detail="Call not found")

    return CallModel.model_validate(call_dict)


@app.post("/answer")
def answer_question(payload: AnswerRequest):
    call_dict = get_call_by_id(payload.call_id)
    if not call_dict:
        raise HTTPException(status_code=404, detail="Call not found")

    transcript_dict = call_dict.get("transcript")
    if not transcript_dict or "text" not in transcript_dict:
        raise HTTPException(status_code=400, detail="Transcript data is missing")

    call_transcript = transcript_dict["text"]

    client = anthropic.Anthropic(
        api_key=settings.ANTHROPIC_API_KEY,
    )

    question_prompt = f"""Given the folowing transcript:\n
        {call_transcript}\n\n
        answer the following question:\n
        {payload.question}
        """
    try:
        message = client.messages.create(
            model="claude-3-5-haiku-20241022",
            max_tokens=1024,
            messages=[
                {"role": "user", "content": question_prompt},
            ],
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Anthropic API error: {str(e)}")

    return AnswerResponse(answer=message.content[0].text)


@lru_cache()
def load_call_data() -> dict:
    with open("data/calls.json") as f:
        return json.load(f)

def get_call_by_id(call_id: str) -> Optional[dict]:
    calls = load_call_data()
    return next((c for c in calls if c["id"] == call_id), None)
