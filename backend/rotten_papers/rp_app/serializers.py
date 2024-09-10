from rest_framework import serializers
from .models import *

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuarios
        fields = '__all__'

class LibroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Libros
        fields = '__all__'
    
class AutorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Autores
        fields = '__all__'

class GeneroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genero
        fields = '__all__'

class LibrogeneroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Librogenero
        fields = '__all__'