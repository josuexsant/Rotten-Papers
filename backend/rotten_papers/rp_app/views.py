from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
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

@api_view(['GET'])
def search_books(request):
    query = request.GET.get('q', '')
    if query:
        books = Books.objects.filter(title__icontains=query)[:10]  # Retorna hasta 10 libros que coincidan con la búsqueda
    else:
        books = Books.objects.none()
    
    results = [{'title': book.title } for book in books]
    return Response(results)
