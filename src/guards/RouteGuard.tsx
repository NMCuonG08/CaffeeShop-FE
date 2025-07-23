import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type { RouteGuard as RouteGuardType } from '@/types';

interface Props {
  children: React.ReactNode;
  guards: RouteGuardType;
}

export const RouteGuard: React.FC<Props> = ({ children, guards }) => {
  const { user, isAuthenticated, hasRole, hasPermission } = useAuth();
  const location = useLocation();

  // Check authentication
  if (guards.auth && !isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Check roles
  if (guards.roles && isAuthenticated) {
    console.log('Checking roles:', guards.roles, 'for user:', user?.roles);
    const requiredRoles = Array.isArray(guards.roles) ? guards.roles : [guards.roles];
    const hasRequiredRole = requiredRoles.some(role => hasRole(role));
    
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Check permissions
  if (guards.permissions && isAuthenticated) {
    const requiredPermissions = Array.isArray(guards.permissions) 
      ? guards.permissions 
      : [guards.permissions];
    const hasRequiredPermission = requiredPermissions.every(permission => 
      hasPermission(permission)
    );
    
    if (!hasRequiredPermission) {
      return <Navigate to="/forbidden" replace />;
    }
  }

  // Check subscription
  if (guards.subscription && isAuthenticated) {
    if (user?.subscription !== guards.subscription) {
      return <Navigate to="/upgrade" replace />;
    }
  }

  return <>{children}</>;
};