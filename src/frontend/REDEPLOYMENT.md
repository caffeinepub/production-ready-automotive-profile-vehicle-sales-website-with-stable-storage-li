# Frontend Redeployment Guide

This document outlines the procedure for redeploying the frontend canister and validating that all routes render correctly after deployment.

## Deployment Procedure

1. **Build the frontend**:
   ```bash
   npm run build
   ```

2. **Deploy the frontend canister**:
   ```bash
   dfx deploy frontend
   ```

3. **Verify deployment**:
   - Check that the build completed without errors
   - Note the frontend canister URL from the deployment output
   - Confirm the canister is serving the latest build by checking the browser console for any version indicators

## Post-Deployment Validation Checklist

After redeployment, manually verify that all critical routes load without blank screens or crashes:

### Public Routes (No Authentication Required)

- [ ] **Home** (`/`) - Should display banner carousel, featured vehicles, and latest blog posts
- [ ] **Passenger Vehicles** (`/mobil-keluarga`) - Should display passenger vehicle listings
- [ ] **Commercial Vehicles** (`/mobil-niaga`) - Should display commercial vehicle listings
- [ ] **Promotions** (`/promo`) - Should display active promotions
- [ ] **Testimonials** (`/testimoni`) - Should display customer testimonials
- [ ] **Blog** (`/blog`) - Should display blog post listings
- [ ] **Contact** (`/kontak`) - Should display contact form

### Admin Routes (Authentication Required)

- [ ] **Admin Login** (`/admin/login`) - Should display login form without crashing
- [ ] **Admin Dashboard** (`/admin`) - Should load after successful login (protected route)

### Validation Steps

1. **Clear browser cache** to ensure you're loading the latest build
2. **Open the frontend canister URL** in a browser
3. **Navigate to each public route** listed above and verify:
   - No blank screens
   - No JavaScript errors in the browser console
   - Content renders as expected
4. **Test admin routes**:
   - Navigate to `/admin/login`
   - Verify the login form displays correctly
   - After login, verify `/admin` dashboard loads

### Common Issues

- **Blank screen on load**: Check browser console for errors; may indicate routing configuration issue
- **404 errors**: Verify the canister is serving the correct build output
- **Authentication failures**: Check that the backend canister is deployed and accessible
- **Stale content**: Clear browser cache and hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

## Route Smoke Verification

The `frontend/src/redeploy/routeSmoke.ts` module provides a centralized list of required routes for validation purposes. This is intended for local/manual verification and does not affect runtime behavior.

### Required Routes

All routes defined in `routeSmoke.ts` must be verified after each deployment to ensure the application is fully functional.
