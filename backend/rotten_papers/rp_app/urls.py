from django.urls import path, include
from rest_framework import routers
from rp_app import views

router = routers.DefaultRouter()
router.register(r'signin', views.UserView,'Usuarios')
router.register(r'books', views.LibroView,'Libros')
router.register(r'author', views.AutorView, 'Autores')
router.register(r'genres', views.GeneroView, 'Generos')
router.register(r'genrebook',views.LibrogeneroView, 'Libro Generos')

urlpatterns = [
    path('rp/', include(router.urls) )
]