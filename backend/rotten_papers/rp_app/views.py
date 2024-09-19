from rest_framework import viewsets
from .serializers import *
from .models import *
# Create your views here.

class UserView(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = Usuarios.objects.all()

class LibroView(viewsets.ModelViewSet):
    serializer_class = LibroSerializer
    queryset = Libros.objects.all()

class AutorView(viewsets.ModelViewSet):
    serializer_class = AutorSerializer
    queryset = Autores.objects.all()

class GeneroView(viewsets.ModelViewSet):
    serializer_class = GeneroSerializer
    queryset = Genero.objects.all()

class LibrogeneroView(viewsets.ModelViewSet):
    serializer_class = LibrogeneroSerializer
    queryset = Librogenero.objects.all()