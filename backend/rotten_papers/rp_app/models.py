from django.db import models
from django.contrib.auth.hashers import make_password
from django.core.validators import EmailValidator
from django.core.exceptions import ValidationError
import re

def validate_no_numbers(value):
    if re.search(r'\d', value):
        raise ValidationError('El campo no puede contener números.')

class Users(models.Model):
    user_id = models.AutoField(primary_key=True)  # ID automático
    name = models.CharField(max_length=255, validators=[validate_no_numbers])  
    lastname1 = models.CharField(max_length=255, validators=[validate_no_numbers])  
    lastname2 = models.CharField(max_length=255, blank=True, null=True, validators=[validate_no_numbers])  
    email = models.EmailField(max_length=255, unique=True, validators=[EmailValidator()])  # Email único con validación
    password = models.CharField(max_length=255)  # Contraseña encriptada
    photo = models.CharField(max_length=255, blank=True, null=True)  # Foto del usuario (opcional)
    
    # Guardar la contraseña encriptada
    def save(self, *args, **kwargs):
        if not self.password.startswith('pbkdf2'):  
            self.password = make_password(self.password)
        super(Users, self).save(*args, **kwargs)

    def __str__(self):
        return f'{self.name} {self.lastname1}' 
    
    class Meta:
        db_table = 'users'

class Genres(models.Model):
    genre_id = models.AutoField(primary_key=True)
    genre = models.CharField(max_length=255)

    def __str__(self):
        return f"Genre: {self.genre}"
    
    class Meta:
        db_table = 'genres'

class Authors(models.Model):
    author_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    lastname1 = models.CharField(max_length=255, blank=True, null=True)
    lastname2 = models.CharField(max_length=255, blank=True, null=True)
 
    def __str__(self):
        return f"Name: {self.name}, lastname1: {self.lastname1}, lastname2: {self.lastname2}"

    class Meta: 
        db_table = 'authors'

class Books(models.Model):
    book_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    author = models.ForeignKey("Authors", on_delete=models.CASCADE)
    synopsis = models.CharField(max_length=255)
    genre = models.ForeignKey("Genres", on_delete=models.CASCADE)
    cover = models.CharField(max_length=255, blank=True, null=True)
    rating = models.FloatField()
    
    def __str__(self):
        return f"Title: {self.title}, Synopsis: {self.synopsis}, Genre: {self.genre}"

    class Meta:
        db_table = 'books'

class BookGenre(models.Model):
    genreB_id = models.AutoField(primary_key=True)
    genre = models.ForeignKey("Genres", on_delete=models.CASCADE)
    book = models.ForeignKey("Books", on_delete=models.CASCADE)
    
    class Meta:
        db_table = 'book_genre'

class Preferences(models.Model):
    preference_id = models.AutoField(primary_key=True)
    user = models.ForeignKey("Users", on_delete=models.CASCADE)
    genre = models.ForeignKey("Genres", on_delete=models.CASCADE)
    
    class Meta:
        db_table = 'preferences'

class Reviews(models.Model):
    review_id = models.AutoField(primary_key=True)
    user = models.ForeignKey("Users", on_delete=models.CASCADE)
    book = models.ForeignKey("Books", on_delete=models.CASCADE)
    rating = models.IntegerField()
    review = models.TextField()
    
    class Meta:
        db_table = 'reviews'

class Favorites(models.Model):
    favorite_id = models.AutoField(primary_key=True)
    user = models.ForeignKey("Users", on_delete=models.CASCADE)
    book = models.ForeignKey("Books", on_delete=models.CASCADE)
    
    class Meta:
        db_table = 'favorites'