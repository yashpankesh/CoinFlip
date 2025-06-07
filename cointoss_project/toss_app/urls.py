# toss_app/urls.py

from django.urls import path
from . import views

urlpatterns = [
    # Route for the main page
    path('', views.index, name='index'),
    
    # Route for the API endpoint that provides the toss result
    path('toss/', views.toss_coin_view, name='toss_coin'),
]