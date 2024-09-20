FROM python:3.8

FROM python:3.8

WORKDIR /app/rotten_papers

COPY rotten_papers/requirements.txt .

RUN pip3 install --upgrade pip -r requirements.txt

COPY rotten_papers/ ./

EXPOSE 8000

CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]