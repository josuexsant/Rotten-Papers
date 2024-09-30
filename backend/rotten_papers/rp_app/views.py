from rest_framework import viewsets
from .serializers import *
from .models import *

class UserView(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = Users.objects.all()

class BookView(viewsets.ModelViewSet):
    serializer_class = BookSerializer
    queryset = Books.objects.all()

class AuthorView(viewsets.ModelViewSet):
    serializer_class = AuthorSerializer
    queryset = Authors.objects.all()

class GenreView(viewsets.ModelViewSet):
    serializer_class = GenreSerializer
    queryset = Genres.objects.all()

class BookGenreView(viewsets.ModelViewSet):
    serializer_class = BookGenreSerializer
    queryset = BookGenre.objects.all()

class PreferencesView(viewsets.ModelViewSet):
    serializer_class = PreferencesSerializer
    queryset = Preferences.objects.all()

class ReviewsView(viewsets.ModelViewSet):
    serializer_class = ReviewsSerializer
    queryset = Reviews.objects.all()

class FavoritesView(viewsets.ModelViewSet):
    serializer_class = FavoritesSerializer
    queryset = Favorites.objects.all()
    
