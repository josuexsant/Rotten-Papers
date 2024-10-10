from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from .serializers import *
from .models import *


# Login
@api_view(['POST'])
def login(request):
  print(request.data)
  user = get_object_or_404(User, username=request.data['username'])
  if not user.check_password(request.data['password']):
    return Response({'message': 'wrong password'}, status=status.HTTP_400_BAD_REQUEST)
  token, created = Token.objects.get_or_create(user=user)
  serializer = UserSerializer(instance=user)
  return Response({'token': token.key, 'user': serializer.data}, status=status.HTTP_200_OK)

# Register
@api_view(['POST'])
def register(request):
  serializer = UserSerializer(data=request.data)
  
  if serializer.is_valid():
    serializer.save()
    
    user = User.objects.get(username=request.data['username'])
    user.set_password(request.data['password'])
    user.save()
    
    token = Token.objects.create(user=user)
    return Response({"token": token.key, "user": serializer.data}, status=status.HTTP_201_CREATED)
  
  return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Logout
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def logout(request):
  request.user.auth_token.delete()
  return Response({'message': 'logged out'}, status=status.HTTP_200_OK)

# Home
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def home(request):
  return Response("Welcome {}".format(request.user.username), status=status.HTTP_200_OK)

# Get books
@api_view(['GET'])
def books(request):
    queryset = Books.objects.all()
    serializer = BookSerializer(queryset, many=True)
    return Response(serializer.data)
  
# Get Author
@api_view(['GET'])
def author(request):
    queryset = Authors.objects.all()
    serializer = AuthorSerializer(queryset, many=True)
    return Response(serializer.data)
  
# Manage favorites
@api_view(['GET', 'POST', 'DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def favorites(request):
  user = request.user
  
  # GET FAVORITES ----------------------
  if request.method == 'GET':
    favorites = Favorites.objects.filter(user_id=user.pk)
    favorite_books = [favorite.book for favorite in favorites]
    serializer = BookSerializer(favorite_books, many=True)
    return Response(serializer.data)
  
  # ADD FAVORITE ----------------------
  elif request.method == 'POST':
    book_id = request.data.get('book_id')
    book = get_object_or_404(Books, book_id=book_id)
    
    favorite, created = Favorites.objects.get_or_create(user_id=user.pk, book=book)
    
    if created:
        return Response({'message': 'Book added to favorites'}, status=status.HTTP_201_CREATED)
    else:
        return Response({'message': 'Book is already in favorites'}, status=status.HTTP_200_OK)

    # DELETE FAVORITE ----------------------
  elif request.method == 'DELETE':
      book_id = request.data.get('book_id')
      book = get_object_or_404(Books, book_id=book_id)
      
      favorite = Favorites.objects.filter(user_id=user.pk, book=book).first()
      
      if favorite:
          favorite.delete()
          return Response({'message': 'Book removed from favorites'}, status=status.HTTP_200_OK)
      else:
          return Response({'message': 'Book not found in favorites'}, status=status.HTTP_404_NOT_FOUND)
  else:
      return Response({'message': 'Invalid request method'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
