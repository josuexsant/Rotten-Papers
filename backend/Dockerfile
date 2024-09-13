FROM python:3.8

WORKDIR /app/rotten_papers

COPY rotten_papers/requirements.txt ./
COPY rotten_papers/ ./

RUN pip3 install --upgrade pip -r requirements.txt

EXPOSE 8000

CMD python3 manage.py runserver 0.0.0.0:8000