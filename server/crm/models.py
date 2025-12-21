from django.db import models
from django.conf import settings

class Customer(models.Model):
    full_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20)
    address = models.TextField(blank=True, null=True)
    account_status = models.CharField(max_length=50, default='Active')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.full_name

class Call(models.Model):
    DIRECTION_CHOICES = (
        ('Inbound', 'Inbound'),
        ('Outbound', 'Outbound'),
    )

    agent = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='calls')
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='calls')
    start_time = models.DateTimeField()
    end_time = models.DateTimeField(null=True, blank=True)
    direction = models.CharField(max_length=10, choices=DIRECTION_CHOICES)
    recording_url = models.URLField(blank=True, null=True, help_text="Encrypted URL or path to recording")
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Call {self.id} - {self.customer} ({self.direction})"

class Ticket(models.Model):
    STATUS_CHOICES = (
        ('Open', 'Open'),
        ('Pending', 'Pending'),
        ('Resolved', 'Resolved'),
    )
    PRIORITY_CHOICES = (
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('High', 'High'),
    )

    title = models.CharField(max_length=200)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Open')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='Medium')
    
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='tickets')
    agent = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='tickets')
    call = models.ForeignKey(Call, on_delete=models.SET_NULL, null=True, blank=True, related_name='tickets')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"#{self.id} - {self.title}"
