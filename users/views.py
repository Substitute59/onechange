from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_http_methods
from core.supabase import supabase
import json

import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')
logger = logging.getLogger(__name__)

@ensure_csrf_cookie
@require_http_methods(['GET'])
def set_csrf_token(request):
    token = request.META.get("CSRF_COOKIE")
    return JsonResponse({"csrfToken": token})

# Vérifie si un email existe déjà
@require_http_methods(["GET"])
def check_email(request):
    email = request.GET.get("email", "").strip()
    if not email:
        return JsonResponse({"error": "Email manquant"}, status=400)

    try:
        users = supabase.auth.admin.list_users()
        matched_users = [u for u in users if u.email == email]

        if matched_users:
            provider = matched_users[0].app_metadata.get("provider", "email")
            return JsonResponse({"exists": True, "provider": provider})

        return JsonResponse({"exists": False})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


# Crée un utilisateur dans Supabase
@require_http_methods(["POST"])
def create_user(request):
    try:
        body = json.loads(request.body)
        supabase_id = body.get("id")
        username = body.get("username")
        avatar_url = body.get("avatar_url", "")
        bio = body.get("bio", "")
        age = body.get("age")
        city = body.get("city", "")

        if not supabase_id or not username:
            return JsonResponse({"error": "id Supabase et username requis"}, status=400)

        result = supabase.table("users").insert({
            "id": supabase_id,
            "username": username,
            "avatar_url": avatar_url,
            "bio": bio,
            "age": age,
            "city": city
        }).execute()

        if not result.data:
            return JsonResponse({"error": "Impossible de créer l'utilisateur"}, status=400)

        return JsonResponse({"user": result.data[0]}, status=201)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

# Récupère un utilisateur par id
@require_http_methods(["GET"])
def get_user(request, user_id):
    try:
        result = supabase.table("users").select("*").eq("id", user_id).execute()

        if not result.data:
            return JsonResponse({"error": "Utilisateur non trouvé"}, status=404)

        return JsonResponse({"user": result.data[0]}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    
@require_http_methods(["PUT"])
def update_user(request, user_id):
    try:
        body = json.loads(request.body)
        result = supabase.table("users").update(body).eq("id", user_id).execute()

        if not result.data:
            return JsonResponse({"error": "Impossible de modifier l'utilisateur"}, status=400)

        return JsonResponse({"user": result.data[0]}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
