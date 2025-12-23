from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, SecurityLog

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'role', 'department', 'is_staff')
    list_filter = ('role', 'department', 'is_staff')
    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('role', 'department', 'phone_extension', 'supervisor', 'access_level', 'dashboard_access')}),
    )

@admin.register(User)
class UserAdmin(CustomUserAdmin):
    pass

@admin.register(SecurityLog)
class SecurityLogAdmin(admin.ModelAdmin):
    list_display = ('timestamp', 'event_type', 'user', 'ip_address')
    list_filter = ('event_type', 'timestamp')
    search_fields = ('user__username', 'ip_address', 'description')
    readonly_fields = ('timestamp',)
