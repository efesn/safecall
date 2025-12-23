from django.contrib import admin
from .models import Customer, Campaign, Call, Ticket

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'phone_number', 'account_status', 'registration_date')
    search_fields = ('full_name', 'email', 'phone_number')
    list_filter = ('account_status', 'registration_date')

@admin.register(Campaign)
class CampaignAdmin(admin.ModelAdmin):
    list_display = ('campaign_name', 'type', 'status', 'start_date', 'end_date')
    list_filter = ('status', 'type')
    search_fields = ('campaign_name',)

@admin.register(Call)
class CallAdmin(admin.ModelAdmin):
    list_display = ('call_id', 'customer', 'agent', 'call_type', 'call_start_time')
    list_filter = ('call_type', 'call_start_time')
    search_fields = ('customer__full_name', 'agent__username')

@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ('ticket_id', 'title', 'status', 'priority_level', 'customer', 'agent')
    list_filter = ('status', 'priority_level', 'created_at')
    search_fields = ('title', 'customer__full_name', 'agent__username')
