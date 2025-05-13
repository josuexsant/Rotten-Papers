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
    re_path('authors', views.authors),
    re_path('favorites', views.favorites),
    re_path('delete_user', views.delete_user),
    re_path(r'^reviews/(?P<book_id>\d+)/$', views.reviews),
    re_path('user_reviews/', views.get_reviews_user),
    re_path('reviews', views.reviews),
    re_path('book', views.book),
    re_path('author', views.author),
    re_path('editProfile', views.editProfile),
    re_path('shoppingCar', views.shopping_cart),
]
