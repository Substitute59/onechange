from django.conf import settings
import requests

def gql(query, variables=None):
    headers = {
        "apikey": settings.SUPABASE_API_KEY,
        "Authorization": f"Bearer {settings.SUPABASE_API_KEY}",
    }
    response = requests.post(
        settings.SUPABASE_URL + '/graphql/v1',
        json={"query": query, "variables": variables or {}},
        headers=headers,
    )
    data = response.json()

    if "errors" in data:
        raise Exception(data["errors"][0]["message"])

    return data["data"]
