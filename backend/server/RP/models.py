from django.contrib.auth.models import User
from django.db import models

class Authors(models.Model):
    author_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    lastname1 = models.CharField(max_length=255, blank=True, null=True)    
    lastname2 = models.CharField(max_length=255, blank=True, null=True)    

    class Meta:
        managed = True
        db_table = 'authors'

class Genres(models.Model):
    genre_id = models.AutoField(primary_key=True)
    genre = models.CharField(max_length=255)

    class Meta:
        managed = True
        db_table = 'genres'


class Preferences(models.Model):
    preference_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, models.DO_NOTHING)
    genre = models.ForeignKey(Genres, models.DO_NOTHING)

    class Meta:
        managed = True
        db_table = 'preferences'

class Books(models.Model):
    book_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    author = models.ForeignKey(Authors, models.DO_NOTHING)
    synopsis = models.CharField(max_length=255)
    genre = models.ForeignKey(Genres, models.DO_NOTHING)
    cover = models.CharField(max_length=255)
    rating = models.FloatField()
    stock = models.BigIntegerField()
    price = models.FloatField()

    class Meta:
        managed = True
        db_table = 'books'

class BookGenre(models.Model):
    genreb_id = models.AutoField(db_column='genreB_id', primary_key=True)
    genre = models.ForeignKey(Genres, models.DO_NOTHING)
    book = models.ForeignKey(Books, models.DO_NOTHING)

    class Meta:
        managed = True
        db_table = 'book_genre'

class Reviews(models.Model):
    review_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, models.DO_NOTHING)
    book = models.ForeignKey(Books, models.DO_NOTHING)
    rating = models.IntegerField()
    review = models.TextField()

    class Meta:
        managed = True
        db_table = 'reviews'

class Favorites(models.Model):
    favorite_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, models.DO_NOTHING)
    book = models.ForeignKey(Books, models.DO_NOTHING)

    class Meta:
        managed = True
        db_table = 'favorites'

class ShoppingCar(models.Model):
    shopping_car_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        managed = True
        db_table = 'shopping_car'

class ShoppingCarBooks(models.Model):
    shopping_car_books_id = models.AutoField(primary_key=True)
    shopping_car = models.ForeignKey(ShoppingCar, on_delete=models.CASCADE)
    book = models.ForeignKey(Books, on_delete=models.CASCADE)

    class Meta:
        managed = True
        db_table = 'shopping_car_books'

class Discounts(models.Model):
    discount_id = models.AutoField(primary_key=True)
    book = models.ForeignKey(Books, on_delete=models.CASCADE)
    expiration_date = models.DateTimeField()
    amount = models.BigIntegerField()

    class Meta:
        managed = True
        db_table = 'discounts'

class Cards(models.Model):
    card_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    card_number = models.CharField(max_length=255)
    bank = models.CharField(max_length=255)
    owner = models.CharField(max_length=255)
    cvv = models.CharField(max_length=255)
    expiration_date = models.DateField()

    class Meta:
        managed = True
        db_table = 'cards'

class Tickets(models.Model):
    ticket_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateTimeField()
    total = models.FloatField()
    address = models.CharField(max_length=255)

    class Meta:
        managed = True
        db_table = 'tickets'

class Purchases(models.Model):
    purchase_id = models.AutoField(primary_key=True)
    ticket = models.ForeignKey(Tickets, on_delete=models.CASCADE)
    book = models.ForeignKey(Books, on_delete=models.CASCADE)
    discount_applied = models.BigIntegerField()

    class Meta:
        managed = True
        db_table = 'purchases'