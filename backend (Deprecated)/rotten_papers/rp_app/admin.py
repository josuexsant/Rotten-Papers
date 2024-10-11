from django.contrib import admin
# admin.py
from .models import Books, Authors, Genres, BookGenre, Preferences, Reviews, Favorites

# Register your models here.
admin.site.register(Books)
admin.site.register(Authors)
admin.site.register(Genres)
admin.site.register(BookGenre)
admin.site.register(Preferences)
admin.site.register(Reviews)
admin.site.register(Favorites)