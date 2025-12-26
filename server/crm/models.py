from django.db import models
from django.conf import settings

class Campaign(models.Model):
    campaign_id = models.AutoField(primary_key=True)
    campaign_name = models.CharField(max_length=255)
    type = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=50)
    target_group = models.CharField(max_length=255)

    def __str__(self):
        return self.campaign_name

class Customer(models.Model):
    customer_id = models.AutoField(primary_key=True)
    full_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20)
    address = models.TextField(blank=True, null=True)
    registration_date = models.DateTimeField(auto_now_add=True)
    account_status = models.CharField(max_length=50, default='Active')
    
    # Assigned Agent (Owner)
    assigned_agent = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_customers')

    # N-M Relationship with Campaign
    campaigns = models.ManyToManyField(Campaign, related_name='customers', blank=True)

    def __str__(self):
        return self.full_name

class Call(models.Model):
    CALL_TYPE_CHOICES = (
        ('Inbound', 'Inbound'),
        ('Outbound', 'Outbound'),
    )

    call_id = models.AutoField(primary_key=True)
    agent = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='calls')
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='calls')
    
    call_start_time = models.DateTimeField()
    call_end_time = models.DateTimeField(null=True, blank=True)
    call_type = models.CharField(max_length=10, choices=CALL_TYPE_CHOICES)
    recording_path = models.URLField(blank=True, null=True, help_text="Path to recording")
    
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Call {self.call_id} - {self.customer}"

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

    ticket_id = models.AutoField(primary_key=True)
    issue_category = models.CharField(max_length=100, default='General')
    priority_level = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='Medium')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Open')
    
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='created_tickets')

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='tickets')
    agent = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='assigned_tickets')
    call = models.OneToOneField(Call, on_delete=models.SET_NULL, null=True, blank=True, related_name='ticket')
    
    title = models.CharField(max_length=200)
    description = models.TextField()

    def __str__(self):
        return f"#{self.ticket_id} - {self.title}"
