from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from . serializers import UserSerializer

@api_view(['POST'])
def login(request):
  print(request.data)
  user = get_object_or_404(User, username=request.data['username'])
  if not user.check_password(request.data['password']):
    return Response({'message': 'wrong password'}, status=status.HTTP_400_BAD_REQUEST)
  token, created = Token.objects.get_or_create(user=user)
  serializer = UserSerializer(instance=user)
  return Response({'token': token.key, 'user': serializer.data}, status=status.HTTP_200_OK)

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

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def logout(request):
  request.user.auth_token.delete()
  return Response({'message': 'logged out'}, status=status.HTTP_200_OK)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def home(request):
  return Response("Welcome {}".format(request.user.username), status=status.HTTP_200_OK)
