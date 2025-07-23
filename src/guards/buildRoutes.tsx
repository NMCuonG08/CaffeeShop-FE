import type { RouteObject } from 'react-router';

import { RouteGuard } from '@/guards/RouteGuard';

export const buildRoutes = (routes: RouteConfig[]): RouteObject[] => {
  return routes.map(route => {
    let element = route.element;

    // Apply guards if they exist
    if (route.guards) {
      element = (
        <RouteGuard guards={route.guards}>
          {route.element}
        </RouteGuard>
      );
    }

    const processedRoute: RouteObject = {
      path: route.path,
      element,
      errorElement: route.errorElement,
      index: route.index,
    };

    // Recursively process children
    if (route.children) {
      processedRoute.children = buildRoutes(route.children);
    }

    return processedRoute;
  });
};