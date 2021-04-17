from django.urls import path

from . import views

app_name = 'game'
urlpatterns = [
    path('', views.index, name='index'),
    path('room_create/', views.create, name='create'),
    path('<str:room_name>/', views.room_view, name='room'),
]
