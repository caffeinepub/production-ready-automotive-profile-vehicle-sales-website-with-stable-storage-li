/**
 * Route smoke verification utilities for post-deployment validation.
 * This module centralizes the list of required public and admin routes
 * for manual smoke testing after redeployment.
 * 
 * Note: This is a non-production helper module intended for local/manual
 * verification only. It does not affect runtime behavior of the shipped UI.
 */

export interface RouteDefinition {
  path: string;
  description: string;
  requiresAuth: boolean;
}

/**
 * Complete list of public routes that must render without blank screens
 */
export const PUBLIC_ROUTES: RouteDefinition[] = [
  {
    path: '/',
    description: 'Home page with banner carousel, featured vehicles, and latest blog posts',
    requiresAuth: false,
  },
  {
    path: '/mobil-keluarga',
    description: 'Passenger vehicles listing page',
    requiresAuth: false,
  },
  {
    path: '/mobil-niaga',
    description: 'Commercial vehicles listing page',
    requiresAuth: false,
  },
  {
    path: '/promo',
    description: 'Promotions listing page',
    requiresAuth: false,
  },
  {
    path: '/testimoni',
    description: 'Customer testimonials page',
    requiresAuth: false,
  },
  {
    path: '/blog',
    description: 'Blog posts listing page',
    requiresAuth: false,
  },
  {
    path: '/kontak',
    description: 'Contact form page',
    requiresAuth: false,
  },
];

/**
 * Complete list of admin routes that must render without crashes
 */
export const ADMIN_ROUTES: RouteDefinition[] = [
  {
    path: '/admin/login',
    description: 'Admin login page',
    requiresAuth: false,
  },
  {
    path: '/admin',
    description: 'Admin dashboard (protected)',
    requiresAuth: true,
  },
];

/**
 * All routes that require smoke verification after deployment
 */
export const ALL_REQUIRED_ROUTES: RouteDefinition[] = [
  ...PUBLIC_ROUTES,
  ...ADMIN_ROUTES,
];

/**
 * Utility to generate a smoke test checklist for manual verification
 */
export function generateSmokeTestChecklist(): string {
  let checklist = '# Post-Deployment Smoke Test Checklist\n\n';
  
  checklist += '## Public Routes\n';
  PUBLIC_ROUTES.forEach(route => {
    checklist += `- [ ] ${route.path} - ${route.description}\n`;
  });
  
  checklist += '\n## Admin Routes\n';
  ADMIN_ROUTES.forEach(route => {
    checklist += `- [ ] ${route.path} - ${route.description}${route.requiresAuth ? ' (requires authentication)' : ''}\n`;
  });
  
  return checklist;
}

/**
 * Utility to validate that all required routes are defined in the router
 * This can be used in development to ensure no routes are missing
 */
export function validateRouterConfiguration(definedPaths: string[]): {
  valid: boolean;
  missingRoutes: string[];
} {
  const requiredPaths = ALL_REQUIRED_ROUTES.map(r => r.path);
  const missingRoutes = requiredPaths.filter(path => !definedPaths.includes(path));
  
  return {
    valid: missingRoutes.length === 0,
    missingRoutes,
  };
}
