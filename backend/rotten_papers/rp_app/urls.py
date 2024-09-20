from django.urls import path, include
from rest_framework import routers
from rp_app import views

router = routers.DefaultRouter()
router.register(r'signin', views.UserView, 'Users')
router.register(r'books', views.BookView, 'Books')
router.register(r'author', views.AuthorView, 'Authors')
router.register(r'genres', views.GenreView, 'Genres')
router.register(r'genrebook', views.BookGenreView, 'BookGenres')
router.register(r'preferences', views.PreferencesView, 'Preferences')
router.register(r'reviews', views.ReviewsView, 'Reviews')
router.register(r'favorites', views.FavoritesView, 'Favorites')

urlpatterns = [
    path('rp/', include(router.urls))
]