FROM python:3.8

WORKDIR /app/rotten_papers

COPY rotten_papers/requirements.txt .

RUN pip3 install --upgrade pip -r requirements.txt

COPY rotten_papers/ ./

EXPOSE 8000

RUN python manage.py makemigrations
RUN python manage.py migrate

CMD [ "python", "manage.py", "runserver", "0.0.0.0:8000" ]
