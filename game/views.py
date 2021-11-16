from django.db import router
from django.http.response import JsonResponse
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework import status
from .serializer import ScoresSerializer
from .models import Scores


from rest_framework.authentication import SessionAuthentication, BasicAuthentication 

class CsrfExemptSessionAuthentication(SessionAuthentication):

    def enforce_csrf(self, request):
        return


# Create your views here.
def index(request):
    return render(request, template_name="index.html")


@api_view(['GET' ,'POST'])
def score_api(request):
    authentication_classes = (CsrfExemptSessionAuthentication, BasicAuthentication)
    if request.method == 'GET':
        scores = Scores.objects.all().order_by("-score")
        serializer = ScoresSerializer(scores, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        post_data = JSONParser().parse(request)
        serializer = ScoresSerializer(data=post_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def best_scores(request, username):
    scores = Scores.objects.all().filter(user = username).order_by("-score")
    serializer = ScoresSerializer(scores, many=True)
    return Response(serializer.data)