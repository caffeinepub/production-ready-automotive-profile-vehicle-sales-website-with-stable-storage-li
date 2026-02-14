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
- [ ] **Media Manager** (`/admin/media`) - Should load media library after admin login
  - Verify media list loads without "Unauthorized" errors
  - Test upload functionality (select and upload an image)
  - Test delete functionality (delete a media asset)
  - Confirm all operations use the stored CMS admin session token

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
5. **Test Media Manager flow** (critical for authorization fix):
   - After admin login, navigate to `/admin/media`
   - Verify the media list loads without authorization errors
   - Upload a test image and confirm it appears in the list
   - Delete a test media asset and confirm it's removed
   - Confirm no separate authentication prompts or "Unauthorized" messages appear

### Common Issues

- **Blank screen on load**: Check browser console for errors; may indicate routing configuration issue
- **404 errors**: Verify the canister is serving the correct build output
- **Authentication failures**: Check that the backend canister is deployed and accessible
- **Stale content**: Clear browser cache and hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- **Media authorization errors**: If "Unauthorized: Only admins can view media assets" appears, verify:
  - Admin login was successful and session token is stored
  - Browser localStorage contains `caffeineAdminSession` key with valid token
  - Backend canister has been redeployed with the authorization fix

## Route Smoke Verification

The `frontend/src/redeploy/routeSmoke.ts` module provides a centralized list of required routes for validation purposes. This is intended for local/manual verification and does not affect runtime behavior.

### Required Routes

All routes defined in `routeSmoke.ts` must be verified after each deployment to ensure the application is fully functional.

### Media Manager Authorization Notes

The Media Manager uses the same admin session token as all other CMS operations. The frontend:
- Retrieves the session token from `localStorage` (key: `caffeineAdminSession`)
- Passes this token to all media API calls (`getMediaAssets`, `createMediaAsset`, `deleteMediaAsset`)
- The backend validates the token using `requireAdminSession(token)` for all media operations

No separate authorization or principal whitelist is required for media access. Any admin who can successfully log in via `/admin/login` should be able to use the Media Manager without additional authorization errors.
