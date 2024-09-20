from rest_framework import viewsets
from .serializers import *
from .models import *
# Create your views here.

class UserView(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = Users.objects.all()

class LibroView(viewsets.ModelViewSet):
    serializer_class = LibroSerializer
    queryset = Books.objects.all()

class AutorView(viewsets.ModelViewSet):
    serializer_class = AutorSerializer
    queryset = Authors.objects.all()

class GeneroView(viewsets.ModelViewSet):
    serializer_class = GeneroSerializer
    queryset = Genres.objects.all()

class LibrogeneroView(viewsets.ModelViewSet):
    serializer_class = LibrogeneroSerializer
    queryset = Book_Genre.objects.all()