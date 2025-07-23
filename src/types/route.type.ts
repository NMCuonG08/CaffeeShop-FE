export interface RouteGuard {
  auth?: boolean;
  roles?: string | string[];
  permissions?: string | string[];
  subscription?: string;
}

export interface RouteConfig {
  path: string;
  element: React.ReactElement;
  children?: RouteConfig[];
  guards?: RouteGuard;
  errorElement?: React.ReactElement;
  index?: boolean;
}