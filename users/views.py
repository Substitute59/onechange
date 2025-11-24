from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_http_methods
from core.supabase import supabase
from core.supabase_graphql import gql


def handle_avatar_upload(user_id: str, avatar_file, old_url: str = "") -> str:
    if not avatar_file:
        return old_url

    if old_url:
        path = old_url.split("/avatars/")[-1]
        supabase.storage.from_("avatars").remove([path])

    file_bytes = avatar_file.read()
    supabase.storage.from_("avatars").upload(
        f"{user_id}/{avatar_file.name}",
        file_bytes,
        {"content-type": avatar_file.content_type}
    )
    return supabase.storage.from_("avatars").get_public_url(f"{user_id}/{avatar_file.name}")


def build_user_data(request_post, files=None, existing_avatar_url="", userId=None):
    avatar_file = files.get("avatar") if files else None

    data = {}
    for field in ["username", "bio", "city"]:
        value = request_post.get(field)
        if value is not None:
            data[field] = value

    age = request_post.get("age")
    if age:
        data["age"] = int(age)

    if avatar_file:
        data["avatar_url"] = handle_avatar_upload(userId or request_post.get("id") or request_post.get("user_id"), avatar_file, existing_avatar_url)

    return data


@ensure_csrf_cookie
@require_http_methods(["GET"])
def set_csrf_token(request):
    token = request.META.get("CSRF_COOKIE")
    return JsonResponse({"csrfToken": token})


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


@require_http_methods(["POST"])
def create_user(request):
    try:
        supabase_id = request.POST.get("id")
        if not supabase_id or not request.POST.get("username"):
            return JsonResponse({"error": "id Supabase et username requis"}, status=400)

        user_data = build_user_data(request.POST, request.FILES)
        user_data["id"] = supabase_id

        query = """
        mutation InsertUser($objects: [usersInsertInput!]!) {
            insertIntousersCollection(objects: $objects) {
                records {
                    id
                    username
                    avatar_url
                    bio
                    age
                    city
                }
            }
        }
        """

        result = gql(query, {"objects": [user_data]})

        records = result.get("insertIntousersCollection", {}).get("records", [])
        
        if not records:
            return JsonResponse({"error": "Échec de création"}, status=500)

        return JsonResponse({"user": records[0]}, status=201)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@require_http_methods(["GET"])
def get_user(request, user_id):
    try:
        query = """
        query GetUser($id: UUID!) {
            usersCollection(filter: { id: { eq: $id } }) {
                edges {
                    node {
                        id
                        username
                        avatar_url
                        bio
                        age
                        city
                    }
                }
            }
        }
        """

        result = gql(query, {"id": user_id})

        edges = result.get("usersCollection", {}).get("edges", [])

        if not edges:
            return JsonResponse({"error": "Utilisateur non trouvé"}, status=404)

        user = edges[0]["node"]

        return JsonResponse({"user": user}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@require_http_methods(["POST"])
def update_user(request, user_id):
    try:
        user_data = build_user_data(
            request.POST, 
            request.FILES, 
            existing_avatar_url=request.POST.get("avatar_url", ""), 
            userId=user_id
        )

        query = """
        mutation UpdateUser($id: UUID!, $set: usersUpdateInput!) {
            updateusersCollection(filter: { id: { eq: $id } }, set: $set) {
                records {
                    id
                    username
                    avatar_url
                    bio
                    age
                    city
                }
            }
        }
        """

        result = gql(query, {"id": user_id, "set": user_data})

        records = result.get("updateusersCollection", {}).get("records", [])
        
        if not records:
            return JsonResponse({"error": "Utilisateur non trouvé ou mise à jour échouée"}, status=404)

        return JsonResponse({"user": records[0]}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
