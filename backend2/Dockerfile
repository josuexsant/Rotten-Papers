FROM python:3.8

WORKDIR /app/server

COPY server/requirements.txt .

RUN pip3 install --upgrade pip -r requirements.txt

COPY server/ ./

EXPOSE 8000

CMD ["sh", "-c", "python manage.py makemigrations && python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]