from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('Agent', 'Agent'),
        ('Supervisor', 'Supervisor'),
        ('Admin', 'Admin'),
    )
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='Agent')
    department = models.CharField(max_length=100, blank=True, null=True)
    phone_extension = models.CharField(max_length=10, blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({self.role})"

class SecurityLog(models.Model):
    EVENT_TYPES = (
        ('Login', 'Login'),
        ('Data Access', 'Data Access'),
        ('Failed Attempt', 'Failed Attempt'),
    )

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    event_type = models.CharField(max_length=50, choices=EVENT_TYPES)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    details = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.event_type} - {self.user} - {self.timestamp}"
