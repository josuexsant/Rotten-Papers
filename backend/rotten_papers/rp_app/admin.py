from django.contrib import admin
from .models import Users, Genres, Books, Authors, Book_Genre, Preferences, Reviews, Favorites

# Register your models here.

admin.site.register(Users)
admin.site.register(Genres)
admin.site.register(Books)
admin.site.register(Authors)
admin.site.register(Book_Genre)
admin.site.register(Preferences)
admin.site.register(Reviews)
admin.site.register(Favorites)
