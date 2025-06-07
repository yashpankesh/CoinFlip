# toss_app/views.py

from django.shortcuts import render
from django.http import JsonResponse
import random

def index(request):
    """
    Renders the main coin toss page.
    """
    return render(request, 'toss_app/index.html')

def toss_coin_view(request):
    """
    Handles the AJAX request to get a random coin toss result.
    Returns the result as JSON.
    """
    result = random.choice(['Heads', 'Tails'])
    return JsonResponse({'result': result})