from django.urls import path, include
from rest_framework import routers
from rp_app import views

router = routers.DefaultRouter()
router.register(r'signin', views.UserView,'Usuarios')

urlpatterns = [
    path('rp/', include(router.urls) ),
]