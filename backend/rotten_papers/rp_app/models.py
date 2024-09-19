from django.db import models
from django.contrib.auth.hashers import make_password
from django.core.validators import EmailValidator
from django.core.exceptions import ValidationError
import re
from django.db import models


def validate_no_numbers(value):
    if re.search(r'\d', value):
        raise ValidationError('El campo no puede contener números.')


class Usuarios(models.Model):
    user_id = models.AutoField(primary_key=True)  # ID automático
    name = models.CharField(max_length=50, validators=[validate_no_numbers])  
    lastname1 = models.CharField(max_length=50, validators=[validate_no_numbers])  
    lastname2 = models.CharField(max_length=50, blank=True, null=True,validators=[validate_no_numbers])  
    email = models.EmailField(max_length=100, unique=True, validators=[EmailValidator()])  # Email único con validación
    password = models.CharField(max_length=255)  # Contraseña encriptada
    photo = models.CharField(max_length= 255,  blank=True, null=True)  # Foto del usuario (opcional)
    # Guardar la contraseña encriptada
    def save(self, *args, **kwargs):
        if not self.password.startswith('pbkdf2'):  
            self.password = make_password(self.password)
        super(Usuarios, self).save(*args, **kwargs)

    def __str__(self):
        return f'{self.name} {self.lastname1}' 
    
    class Meta:
        db_table = 'Usuarios'

class Libros(models.Model):
    book_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=250)
    author_id = models.ForeignKey("Autores", on_delete=models.CASCADE)
    synopsis = models.TextField(blank=False)
    genre_id = models.ForeignKey("Genero", on_delete=models.CASCADE)
    cover = models.URLField(max_length=250, blank=True, null=True)
    rating = models.DecimalField(max_digits=2, decimal_places=1)
    
    def __str__(self):
        return (f"Title: {self.title}, "
                f"Synopsis: {self.synopsis}, Genre: {self.genre_id},")

    class Meta:
        db_table = 'Libros'

class Autores(models.Model):
    author_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=250)
    lastname1 = models.CharField(max_length=250)
    lastname2 = models.CharField(max_length=250)
 
    def __str__(self):
        return (f"Name: {self.name}, "
                f"lastname1: {self.lastname1}"
                f"lastname2: {self.lastname2}")

    class Meta: 
        db_table = 'Autores'


class Genero(models.Model):
    genre_id = models.AutoField(primary_key=True)
    genre = models.CharField(max_length=250)

    def __str__(self):
        return (f"Genero: {self.genre}")
    

    class Meta:
        db_table = 'Genero'

class Librogenero(models.Model):
    genreB_id = models.AutoField(primary_key=True)
    genre_id = models.ForeignKey("Genero", on_delete=models.CASCADE)
    book_id = models.ForeignKey("Libros", on_delete=models.CASCADE)
    
    class Meta:
        db_table = 'Libro_Genero'