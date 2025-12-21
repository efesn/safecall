from django.contrib.auth.signals import user_logged_in, user_login_failed
from django.dispatch import receiver
from .models import SecurityLog

def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

@receiver(user_logged_in)
def log_user_login(sender, request, user, **kwargs):
    SecurityLog.objects.create(
        user=user,
        event_type='Login',
        ip_address=get_client_ip(request),
        details=f"User {user.username} logged in successfully."
    )

@receiver(user_login_failed)
def log_user_login_failed(sender, credentials, request, **kwargs):
    SecurityLog.objects.create(
        event_type='Failed Attempt',
        ip_address=get_client_ip(request),
        details=f"Login failed for username: {credentials.get('username')}"
    )
