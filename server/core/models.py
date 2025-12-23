from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('Agent', 'Agent'),
        ('Supervisor', 'Supervisor'),
        ('Admin', 'Admin'),
    )
    
    # Common attributes
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='Agent')
    department = models.CharField(max_length=100, blank=True, null=True)
    
    # Agent specific
    phone_extension = models.CharField(max_length=10, blank=True, null=True)
    supervisor = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='agents')
    
    # Supervisor specific
    access_level = models.CharField(max_length=50, blank=True, null=True)
    dashboard_access = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.username} ({self.role})"

class SecurityLog(models.Model):
    EVENT_TYPES = (
        ('Login', 'Login'),
        ('Data Access', 'Data Access'),
        ('Failed Attempt', 'Failed Attempt'),
    )

    log_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='security_logs')
    event_type = models.CharField(max_length=50, choices=EVENT_TYPES)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.event_type} - {self.user} - {self.timestamp}"
