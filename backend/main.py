import json
from datetime import datetime
from typing import List, Optional

import anthropic
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from config import settings


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class CallItem(BaseModel):
    call_id: str
    created_date: str
    title: str


class Profile(BaseModel):
    job_title: str
    location: str
    photo_url: str
    linkedin_url: str


class Participant(BaseModel):
    name: str
    email: Optional[str]
    profile: Optional[Profile]


class CallMetadata(BaseModel):
    title: str
    duration: int
    start_time: datetime
    parties: List[Participant]


class Transcript(BaseModel):
    text: str


class InferenceSummary(BaseModel):
    call_summary: str


class CallModel(BaseModel):
    id: str
    created_at_utc: datetime
    call_metadata: CallMetadata
    transcript: Transcript
    inference_results: InferenceSummary


class AnswerRequest(BaseModel):
    call_id: str
    question: str


class AnswerResponse(BaseModel):
    answer: str


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
    calls_data = load_call_data()

    for call_dict in calls_data:
        if call_dict["id"] == call_id:
            return CallModel.model_validate(call_dict)

    raise HTTPException(status_code=404, detail="Call not found")


@app.post("/answer")
def answer_question(payload: AnswerRequest):
    calls_data = load_call_data()

    for call_dict in calls_data:
        if call_dict["id"] == payload.call_id:
            call_transcript = call_dict["transcript"]["text"]

    client = anthropic.Anthropic(
        api_key=settings.ANTHROPIC_API_KEY,
    )

    question = f"""Given the folowing transcript:\n
    {call_transcript}\n\n
    answer the following question:\n
    {payload.question}
    """
    message = client.messages.create(
        model="claude-3-5-haiku-20241022",
        max_tokens=1024,
        messages=[
            {"role": "user", "content": question},
        ],
    )

    print(message)

    return AnswerResponse(answer=message.content[0].text)


def load_call_data() -> dict:
    with open("data/calls.json") as f:
        return json.load(f)
