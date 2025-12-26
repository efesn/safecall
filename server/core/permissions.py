from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and (request.user.role == 'Admin' or request.user.is_superuser)

class IsSupervisor(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and (request.user.role in ['Admin', 'Supervisor'] or request.user.is_superuser)

class IsAgent(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and (request.user.role in ['Admin', 'Supervisor', 'Agent'] or request.user.is_superuser)
