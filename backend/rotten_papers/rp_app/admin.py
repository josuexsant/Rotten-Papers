from django.contrib import admin
from .models import Libros, Autores, Genero, Librogenero        

# Register your models here.
admin.site.register(Libros)
admin.site.register(Autores)
admin.site.register(Genero)
admin.site.register(Librogenero)
