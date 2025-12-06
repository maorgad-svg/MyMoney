# Email Access Control Setup

## 🔐 Access Control Configuration

Your app now has **email-based access control**. Only users with email addresses in the allowed list can sign in.

---

## 📝 How to Add Allowed Emails

Edit the file: `src/config/allowedEmails.js`

```javascript
export const ALLOWED_EMAILS = [
  'your.email@gmail.com',        // ← Replace with your email
  'family.member@gmail.com',     // ← Add family members
  'trusted.person@gmail.com',    // ← Add trusted people
];
```

---

## ✅ Steps to Configure:

1. **Open the file:**
   ```
   src/config/allowedEmails.js
   ```

2. **Replace the example email** with your actual Google account email:
   ```javascript
   'your.email@gmail.com'  →  'john.doe@gmail.com'
   ```

3. **Add additional emails** (optional):
   - Uncomment the lines (remove `//`)
   - Replace with actual email addresses
   - Add as many as you need

4. **Save the file**

5. **Restart the server** if it's running

---

## 🚨 Important Notes:

### Email Format:
- ✅ Use the **exact email** associated with the Google account
- ✅ Emails are **case-insensitive** (automatically converted to lowercase)
- ✅ Must be a valid Gmail or Google Workspace email

### Security:
- ⚠️ Only listed emails can access the app
- ⚠️ Unauthorized users will see: `"Access denied. The email 'xxx' is not authorized"`
- ⚠️ They will be automatically signed out after attempting to log in

---

## 📋 Examples:

### Single User (You Only):
```javascript
export const ALLOWED_EMAILS = [
  'myemail@gmail.com',
];
```

### Multiple Users:
```javascript
export const ALLOWED_EMAILS = [
  'myemail@gmail.com',
  'spouse@gmail.com',
  'accountant@company.com',
  'financial.advisor@firm.com',
];
```

### Family Access:
```javascript
export const ALLOWED_EMAILS = [
  'dad@gmail.com',
  'mom@gmail.com',
  'child1@gmail.com',
  'child2@gmail.com',
];
```

---

## 🧪 Testing Access Control:

### Test with Your Email:
1. Add your email to `ALLOWED_EMAILS`
2. Go to http://localhost:5173
3. Click "Sign in with Google"
4. Use your email
5. ✅ You should be able to access the dashboard

### Test with Unauthorized Email:
1. Try logging in with an email NOT in the list
2. ❌ You should see: "Access denied. The email '...' is not authorized"
3. ❌ You'll be automatically signed out

---

## 🛠️ How It Works:

1. **User clicks "Sign in with Google"**
2. **Google authentication popup appears**
3. **User signs in with their Google account**
4. **App checks if email is in `ALLOWED_EMAILS` list**
   - ✅ **If YES:** User is logged in → Redirected to dashboard
   - ❌ **If NO:** User is logged out → Error message displayed

---

## 🔄 Adding/Removing Users:

### To Add a User:
1. Open `src/config/allowedEmails.js`
2. Add their email to the array
3. Save the file
4. No restart needed (changes apply immediately to new logins)

### To Remove a User:
1. Open `src/config/allowedEmails.js`
2. Delete their email from the array
3. Save the file
4. They won't be able to log in next time

### To Remove All Access (Just You):
```javascript
export const ALLOWED_EMAILS = [
  'only.my.email@gmail.com',
];
```

---

## 🚀 Before Deploying to Production:

**CRITICAL:** Update the allowed emails list before deploying!

1. Replace `'your.email@gmail.com'` with real emails
2. Remove any test/placeholder emails
3. Verify each email address is correct
4. Test login with each email

---

## ⚠️ Common Issues:

### "Access denied" for my own email
- ✅ Check spelling of your email in `allowedEmails.js`
- ✅ Make sure you're using the same Google account
- ✅ Verify no extra spaces in the email string

### User can't log in
- ✅ Verify their email is in `ALLOWED_EMAILS`
- ✅ Check they're using the correct Google account
- ✅ Ensure email matches exactly (case doesn't matter)

### Changes not working
- ✅ Refresh the browser (Cmd/Ctrl + R)
- ✅ Clear browser cache
- ✅ Try in incognito/private window
- ✅ Check browser console for errors

---

## 📍 File Location:

```
net-worth-dashboard/
└── src/
    └── config/
        └── allowedEmails.js  ← Edit this file
```

---

## 🔒 Security Best Practices:

1. **Keep the list minimal** - Only add emails that need access
2. **Use work emails** for professional access
3. **Review periodically** - Remove emails that no longer need access
4. **Don't share** the allowed emails list publicly
5. **Use Google Workspace** for better control if needed

---

## Next Steps:

1. ✅ Open `src/config/allowedEmails.js`
2. ✅ Add your email address
3. ✅ Add any other authorized emails
4. ✅ Save the file
5. ✅ Test logging in
6. ✅ Commit changes when ready

---

**Your financial data is now protected!** 🔐

