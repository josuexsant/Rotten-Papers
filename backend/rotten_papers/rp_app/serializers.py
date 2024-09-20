from rest_framework import serializers
from .models import *

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = '__all__'

class LibroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Books
        fields = '__all__'
    
class AutorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Authors
        fields = '__all__'

class GeneroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genres
        fields = '__all__'

class LibrogeneroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book_Genre
        fields = '__all__'