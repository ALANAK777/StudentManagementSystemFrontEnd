# Frontend Deployment to Vercel

## Prerequisites
- Vercel account
- GitHub repository
- Backend already deployed to Vercel

## Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Prepare frontend for Vercel deployment"
git push origin main
```

### 2. Deploy to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Select the `frontend` folder as the root directory
5. Vercel will auto-detect it as a Vite project

### 3. Environment Variables
Add these environment variables in Vercel Dashboard:

```
VITE_API_URL=https://your-backend-app.vercel.app/api
VITE_APP_NAME=Student Management System
```

### 4. Build Settings (Auto-detected)
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### 5. Important Notes
- Update `VITE_API_URL` with your actual backend Vercel URL
- After frontend deployment, update the `FRONTEND_URL` in your backend environment variables
- The frontend will be available at: `https://your-frontend-app.vercel.app`

### 6. Post-Deployment
1. Update backend's `FRONTEND_URL` environment variable with your frontend URL
2. Test the complete application flow
3. Verify email verification and password reset links work correctly

## File Structure
```
frontend/
├── vercel.json          # Vercel configuration
├── vite.config.js       # Enhanced Vite config
├── package.json        # Updated with engines field
├── .env.production     # Environment template
└── dist/               # Build output directory
```

## Testing Deployment
1. Visit your deployed frontend URL
2. Test login/signup functionality
3. Test email verification flow
4. Test password reset functionality
5. Verify all API calls work correctly
