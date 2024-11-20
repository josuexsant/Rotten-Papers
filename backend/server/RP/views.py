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
  user = get_object_or_404(User, email=request.data['email'])
  if not user.check_password(request.data['password']):
    return Response({'message': 'wrong password'}, status=status.HTTP_400_BAD_REQUEST)
  token, created = Token.objects.get_or_create(user=user)
  serializer = UserSerializer(instance=user)
  return Response({'token': token.key, 'user': serializer.data}, status=status.HTTP_200_OK)


# Delete user
@api_view(['DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def delete_user(request):
  user = request.user
  user.delete()
  return Response({'message': 'User deleted'}, status=status.HTTP_200_OK)


# Register
@api_view(['POST'])
def register(request):
  username = request.data.get('username')
  email = request.data.get('email')
  first_name = request.data.get('first_name')
  last_name = request.data.get('last_name')
  
  if User.objects.filter(username=username).exists():
    return Response({'message': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
  
  if User.objects.filter(email=email).exists():
    return Response({'message': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
  
  serializer = UserSerializer(data=request.data)
  
  if serializer.is_valid():
    serializer.save()
    
    user = User.objects.get(username=username)
    user.set_password(request.data['password'])
    user.first_name = first_name
    user.last_name = last_name
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
def authors(request):
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
    
#REVIEWS ----------------------
@api_view(['GET', 'POST', 'DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def reviews(request):
  user = request.user

  # GET REVIEWS ----------------------
  if request.method == 'GET':
        book_id = request.query_params.get('book_id')
        if book_id:
            reviews = Reviews.objects.filter(book_id=book_id)
            if reviews.exists():
                serializer = ReviewsSerializer(reviews, many=True)
                reviews_data = serializer.data
                for review in reviews_data:
                    user = User.objects.get(id=review['user'])
                    review['user'] = user.username
                return Response(reviews_data)
            else:
                return Response({"message": "Aún no tienes reseñas para este libro."})
        else:
            return Response({"error": "Por favor proporciona un book_id válido."}, status=400)

  # POST REVIEWS ----------------------
  elif request.method == 'POST': 
    book_id = request.data.get('book_id')
    review_text = request.data.get('review')
    rating = request.data.get('rating')

    book = get_object_or_404(Books, book_id=book_id)

    user_instance = get_object_or_404(Users, pk=user.pk)
    review = Reviews.objects.create(
      user=user_instance,
      book=book,
      review=review_text,
      rating=rating
    )

    serializer = ReviewsSerializer(review)
    return Response(serializer.data, status=status.HTTP_201_CREATED)
      
@api_view(['GET'])
def book(request):
    book_id = request.query_params.get('book_id')
    book = get_object_or_404(Books, book_id=book_id)
    serializer = BookSerializer(book)
    return Response(serializer.data, status=status.HTTP_200_OK)

# Get Author
@api_view(['GET'])
def author(request):
    author_id = request.query_params.get('author_id')
    author = get_object_or_404(Authors, author_id=author_id)
    serializer = AuthorSerializer(author)
    return Response(serializer.data, status=status.HTTP_200_OK)

#Get Reviews de Usuario Autenticado
@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_reviews_user(request):
    user_id = request.user.id
    print(f"Usuario autenticado: {user_id}")
    book_id = request.query_params.get('book_id')
    review = Reviews.objects.filter(user_id=user_id, book_id=book_id)
    serializer = ReviewsSerializer(review, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

# Vista para editar el perfil
@api_view(['PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def editProfile(request):
  import logging
  logger = logging.getLogger(__name__)
  logger.info("Datos recibidos en el backend: %s", request.data)  # Ver los datos que llegan al backend

  user = request.user

  # Obtener los datos de la solicitud
  user_data = {
      'username': request.data.get('username'),
      'first_name': request.data.get('first_name'),
      'last_name': request.data.get('last_name'),
      'email': request.data.get('email'),
  }
  
  if user_data['username'] and User.objects.filter(username=user_data['username']).exclude(id=user.id).exists():
    return Response({'message': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

  if(user_data['email'] and User.objects.filter(email=user_data['email']).exclude(id=user.id).exists()):
    return Response({'message': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
  # Actualizar los datos
  for attr, value in user_data.items():
      if value:
          setattr(user, attr, value)
  user.save()

  serializer = UserSerializer(user)
  return Response({"user": serializer.data, "message": "User updated successfully"}, status=status.HTTP_200_OK)
