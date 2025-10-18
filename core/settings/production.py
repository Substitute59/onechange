from .base import *
import os

DEBUG = False

ALLOWED_HOSTS = ['onechange-uv0r.onrender.com']

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

MIDDLEWARE.insert(1, 'whitenoise.middleware.WhiteNoiseMiddleware')

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

CORS_ALLOW_CREDENTIALS = False
CSRF_TRUSTED_ORIGINS = [
    "https://onechange-uv0r.onrender.com",
    "http://localhost:8000",
    "https://onechange.vercel.app",
    "http://localhost:5173"
]

CORS_ALLOWED_ORIGINS = [
    "https://onechange-uv0r.onrender.com",
    "http://localhost:8000",
    "https://onechange.vercel.app",
    "http://localhost:5173"
]
