from rest_framework import viewsets
from .serializers import UserSerializer
from .models import Usuarios
# Create your views here.

class UserView(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = Usuarios.objects.all()