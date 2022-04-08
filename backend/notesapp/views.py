from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse
from .models import Note
from django.forms.models import model_to_dict
import json
from django.contrib.auth import authenticate, login
from django.shortcuts import redirect
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def getAllNotes(request):
    if request.user.is_authenticated:
        username = request.user.username
        notes = Note.objects.filter(username=username)
        # serialized_queryset = serializers.serialize('json', notes)
        s = []
        for note in notes:
            data = model_to_dict(note)
            s.append(data)
        return HttpResponse(json.dumps(s))
    else:
        return HttpResponse("dfsfgdfg")

@csrf_exempt
def updateNote(request):
    if request.user.is_authenticated:
        isPinned = request.POST.get('isPinned')
        title = request.POST.get('title')
        note = request.POST.get('note')
        id = request.POST.get('id')
        if isPinned == "true":
            isPinned = True
        else:
            isPinned = False
        print(isPinned)
        print(title)
        print(note)
        print(id)
        notes = Note.objects.filter(id=int(id)).update(isPinned=isPinned, title=title, note=note)
        return HttpResponse("Ok")
    else:
        return HttpResponse("dfsfgdfg")

@csrf_exempt
def login_view(request):
    username = request.POST.get('username')
    password = request.POST.get('password')
    print(username)
    print(password)
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return HttpResponse("Authenticated")
        pass
    else:
        return HttpResponse("Unauthorized")
        # Return an 'invalid login' error message.
        pass

@csrf_exempt
def checkAuth(request):
    if request.user.is_authenticated:
        return HttpResponse("Authenticated")
    else:
        return HttpResponse("Unauthorized")

@csrf_exempt
def login_page(request):
    print("This is the username: " + request.user.username)
    if request.user.is_authenticated:
        response = redirect('/notes/')
        return response
    else:
        return render(request, 'notes/login.html')

@csrf_exempt
def notes(request):
    print("This is the username: " + request.user.username)
    if request.user.is_authenticated:
        return render(request, 'notes/notes.html')
    else:
        response = redirect('/notes/')
        return response