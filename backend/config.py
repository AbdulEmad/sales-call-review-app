import ast
from typing import Union, List

from pydantic import Field
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    ANTHROPIC_API_KEY: str = Field(..., env="ANTHROPIC_API_KEY")

    BACKEND_CORS_ORIGINS: Union[List[str], str] = Field(..., env="BACKEND_CORS_ORIGINS")

    def get_cors_origins(self):
        return ast.literal_eval(self.BACKEND_CORS_ORIGINS)


settings = Settings()
