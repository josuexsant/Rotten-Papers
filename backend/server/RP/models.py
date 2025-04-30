from rest_framework import serializers
from .models import *

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['user_id', 'name', 'lastname1', 'lastname2', 'email', 'password', 'photo']
        extra_kwargs = {'password': {'write_only': True}}

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Authors
        fields = '_all_'

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genres
        fields = '_all_'

class BookSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)
    genre = GenreSerializer(read_only=True)
    
    class Meta:
        model = Books
        fields = '_all_'
        depth = 1

class BookGenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookGenre
        fields = '_all_'

class PreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Preferences
        fields = '_all_'

class ReviewsSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    book = BookSerializer(read_only=True)
    
    class Meta:
        model = Reviews
        fields = '_all_'
        depth = 1

class FavoritesSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    book = BookSerializer(read_only=True)
    
    class Meta:
        model = Favorites
        fields = '_all_'
        depth = 1

class ShoppingCarSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = ShoppingCar
        fields = '_all_'

class ShoppingCarBooksSerializer(serializers.ModelSerializer):
    shopping_car = ShoppingCarSerializer(read_only=True)
    book = BookSerializer(read_only=True)
    
    class Meta:
        model = ShoppingCarBooks
        fields = '_all_'
        depth = 1

class DiscountsSerializer(serializers.ModelSerializer):
    book = BookSerializer(read_only=True)
    
    class Meta:
        model = Discounts
        fields = '_all_'

class CardsSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Cards
        fields = '_all_'
        extra_kwargs = {
            'card_number': {'write_only': True},
            'cvv': {'write_only': True}
        }

class TicketsSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Tickets
        fields = '_all_'

class PurchasesSerializer(serializers.ModelSerializer):
    ticket = TicketsSerializer(read_only=True)
    book = BookSerializer(read_only=True)
    
    class Meta:
        model = Purchases
        fields = '_all_'
        depth = 1