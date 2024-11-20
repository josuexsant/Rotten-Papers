from django.contrib.auth.models import AbstractUser
from django.db import models

class Authors(models.Model):
    author_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    lastname1 = models.CharField(max_length=255, blank=True, null=True)    
    lastname2 = models.CharField(max_length=255, blank=True, null=True)    

    class Meta:
        managed = True
        db_table = 'authors'

class BookGenre(models.Model):
    genreb_id = models.AutoField(db_column='genreB_id', primary_key=True)  # Field name made lowercase.
    genre = models.ForeignKey('Genres', models.DO_NOTHING)
    book = models.ForeignKey('Books', models.DO_NOTHING)

    class Meta:
        managed = True
        db_table = 'book_genre'

class Books(models.Model):
    book_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    author = models.ForeignKey(Authors, models.DO_NOTHING)
    synopsis = models.CharField(max_length=255)
    genre = models.ForeignKey('Genres', models.DO_NOTHING)
    cover = models.CharField(max_length=255)
    rating = models.FloatField()

    class Meta:
        managed = True
        db_table = 'books'

class Favorites(models.Model):
    favorite_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('Users', models.DO_NOTHING)
    book = models.ForeignKey(Books, models.DO_NOTHING)

    class Meta:
        managed = True
        db_table = 'favorites'

class Genres(models.Model):
    genre_id = models.AutoField(primary_key=True)
    genre = models.CharField(max_length=255)

    class Meta:
        managed = True
        db_table = 'genres'

class Preferences(models.Model):
    preference_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('Users', models.DO_NOTHING)
    genre = models.ForeignKey(Genres, models.DO_NOTHING)

    class Meta:
        managed = True
        db_table = 'preferences'

class Reviews(models.Model):
    review_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('Users', models.DO_NOTHING)
    book = models.ForeignKey(Books, models.DO_NOTHING)
    rating = models.IntegerField()
    review = models.TextField()

    class Meta:
        managed = True
        db_table = 'reviews'

class Users(models.Model):
    user_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    lastname1 = models.CharField(max_length=255)
    lastname2 = models.CharField(max_length=255)
    email = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    photo = models.CharField(max_length=255)

    class Meta:
        managed = True
        db_table = 'users'