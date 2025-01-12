from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel


class CallItem(BaseModel):
    call_id: str
    created_date: datetime
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
