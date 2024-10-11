from django.urls import path, include
from rest_framework import routers
from rp_app import views

router = routers.DefaultRouter()
router.register(r'author', views.AuthorView, 'Authors')
router.register(r'books', views.BookView, 'Books')
#router.register(r'genres', views.GenreView, 'Genres')
#outer.register(r'genrebook', views.BookGenreView, 'BookGenres')
#router.register(r'preferences', views.PreferencesView, 'Preferences')
#router.register(r'reviews', views.ReviewsView, 'Reviews')
#router.register(r'favorites', views.FavoritesView, 'Favorites')
router.register(r'register', views.RegisterView, 'Register')
router.register(r'login', views.LoginView, 'Login')
router.register(r'logout', views.LogoutView, 'Logout')

urlpatterns = [
    path('rp/', include(router.urls)),
    path('home/', views.HomeView.as_view(), name ='home')
]