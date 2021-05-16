"""
ASGI config for mysite project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/asgi/
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mysite.settings.production')
django.setup()

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
import game.routing
from .channels_middleware import JwtAuthMiddlewareStack


application = ProtocolTypeRouter({
    'http': get_asgi_application(),
    # Just HTTP for now. (We can add other protocols later.)
    'websocket': JwtAuthMiddlewareStack(
        URLRouter(
            game.routing.websocket_urlpatterns
        )
    )
})
