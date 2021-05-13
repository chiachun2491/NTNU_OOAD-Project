from django.urls import path

from . import views

app_name = 'game_api'
urlpatterns = [
    path('room_create/', views.GameRoomCreate.as_view(), name='create'),
    path('room_list/', views.GameRoomList.as_view(), name='list'),
    path('<str:room_name>/', views.GameRoomDetail.as_view(), name='room'),
]
