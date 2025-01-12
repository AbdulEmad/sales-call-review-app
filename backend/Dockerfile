FROM python:3.13.1

WORKDIR /app

RUN pip install -U poetry

COPY pyproject.toml poetry.lock /app/

RUN poetry install --no-root


COPY . /app

ENV PYTHONPATH=src

EXPOSE 8000

CMD ["poetry", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
