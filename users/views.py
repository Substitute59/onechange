# users/views.py
from django.http import JsonResponse
from core.supabase import supabase
from django.views.decorators.http import require_http_methods

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
