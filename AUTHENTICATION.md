# Google Authentication Setup

This application now requires Google authentication to access the dashboard.

## Features Implemented

✅ **Firebase Authentication** - Secure authentication with Google  
✅ **Protected Routes** - Dashboard only accessible after login  
✅ **User Profile** - Display user name and photo in header  
✅ **Logout Functionality** - Easy sign out from any page  
✅ **Responsive Login Page** - Beautiful login screen  

## Configuration

### Environment Variables

The following Firebase configuration has been added to your `.env` file:

```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Firebase Project

Your Firebase project is configured at:
- **Project**: mymoney-e92e1
- **Authentication Method**: Google Sign-In (enabled)
- **Console**: https://console.firebase.google.com/project/mymoney-e92e1

## How It Works

1. **Unauthenticated users** visiting the app are redirected to `/login`
2. **Login page** offers "Sign in with Google" button
3. **After authentication**, users are redirected to the dashboard
4. **User info** (name/email and photo) appears in the header
5. **Logout button** signs the user out and returns to login page

## File Structure

```
src/
├── config/
│   └── firebase.js              # Firebase initialization
├── contexts/
│   └── AuthContext.jsx          # Authentication state management
├── components/
│   ├── ProtectedRoute.jsx       # Route protection wrapper
│   └── Header.jsx               # Updated with user info and logout
├── pages/
│   ├── Login.jsx                # Login page with Google sign-in
│   └── Dashboard.jsx            # Main dashboard (protected)
└── App.jsx                      # Routing configuration
```

## Security

- All routes except `/login` are protected
- Firebase handles authentication securely
- User tokens are managed by Firebase SDK
- No sensitive credentials are stored in the app code
- Only authenticated users can access financial data

## Restricting Access to Specific Email(s)

If you want to restrict access to only your email address, you can modify the `AuthContext.jsx`:

```javascript
// In src/contexts/AuthContext.jsx, update loginWithGoogle:

const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Restrict to specific email(s)
    const allowedEmails = ['your.email@gmail.com'];
    if (!allowedEmails.includes(user.email)) {
      await signOut(auth);
      throw new Error('Access denied. This app is for authorized users only.');
    }
    
    return user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};
```

## Testing

To test the authentication:

1. Stop the dev server if running (Ctrl+C)
2. Start the dev server: `npm run dev`
3. Open http://localhost:5173
4. You should see the login page
5. Click "Sign in with Google"
6. Authenticate with your Google account
7. You'll be redirected to the dashboard

## Troubleshooting

**Error: "Firebase: Error (auth/unauthorized-domain)"**
- Solution: Add `localhost` and your production domain to Authorized Domains in Firebase Console:
  - Go to Authentication → Settings → Authorized domains
  - Add `localhost` for development
  - Add your production domain when deploying

**Error: "User not authenticated"**
- Clear browser cache and cookies
- Try signing out and back in
- Check Firebase Console for authentication logs

**Login button not working**
- Check browser console for errors
- Verify Firebase credentials in `.env`
- Ensure Firebase project has Google authentication enabled



