from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password',"first_name","last_name"]
        
class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Books
        fields = '__all__'
    
class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Authors
        fields = '__all__'

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genres
        fields = '__all__'

class BookGenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookGenre
        fields = '__all__'

class PreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Preferences
        fields = '__all__'

class ReviewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reviews
        fields = '__all__'

class FavoritesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorites
        fields = '__all__'

# Serializador para el modelo Discount
class DiscountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discounts
        fields = '__all__'

# Serializador para el modelo Card
class CardSerializer(serializers.ModelSerializer):
    user = UserSerializer()  # Incluye información detallada del usuario

    class Meta:
        model = Cards
        fields = '__all__'

# Serializador para el modelo Ticket
class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tickets
        fields = '__all__'
