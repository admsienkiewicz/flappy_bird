from django.urls import path
from django.urls.conf import include
from rest_framework import routers
from . import views


urlpatterns = [
    path('', views.index, name='index'),
    path('score-api', views.score_api),
    path('best-scores/<username>', views.best_scores)
]