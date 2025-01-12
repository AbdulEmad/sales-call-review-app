FROM python:3.12.6

WORKDIR /app

RUN pip install -U poetry

COPY pyproject.toml poetry.lock /app/

RUN poetry install --no-root


COPY . /app

ENV PYTHONPATH=src

EXPOSE 8000

CMD ["poetry", "run", "uvicorn", "src.chaka_chaka.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
