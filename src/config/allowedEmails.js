/**
 * Access Control Configuration
 * 
 * Add email addresses that are allowed to access the application.
 * Only users with these email addresses can sign in.
 */

export const ALLOWED_EMAILS = [
  'maorgad@gmail.com',
  'yardenassa@gmail.com',
  'adamrakib@gmail.com',
];

/**
 * Check if an email is allowed to access the app
 */
export function isEmailAllowed(email) {
  if (!email) return false;
  return ALLOWED_EMAILS.includes(email.toLowerCase());
}

