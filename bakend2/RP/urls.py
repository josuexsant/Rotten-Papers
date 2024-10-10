from django.contrib import admin
from django.urls import path, re_path
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    re_path('login', views.login),
    re_path('register', views.register),
    re_path('logout', views.logout),
    re_path('home', views.home),
    re_path('books', views.books),
    re_path('author', views.author),
    re_path('favorites', views.favorites)
]
