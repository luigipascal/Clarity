// POST /api/auth/logout
// Logs out the current user by destroying their session

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get session token from cookie
  const cookies = parseCookies(req.headers.cookie || '');
  const sessionToken = cookies.clarity_session;

  if (sessionToken) {
    try {
      const Airtable = require('airtable');
      const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
        .base(process.env.AIRTABLE_BASE_ID);

      // Find and delete session
      const sessions = await base('Clarity_Sessions')
        .select({
          filterByFormula: `{token} = '${sessionToken}'`,
          maxRecords: 1
        })
        .firstPage();

      if (sessions.length > 0) {
        await base('Clarity_Sessions').destroy([sessions[0].id]);
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Continue anyway - clear the cookie
    }
  }

  // Clear the session cookie
  res.setHeader('Set-Cookie', [
    'clarity_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0'
  ]);

  return res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
}

function parseCookies(cookieString) {
  const cookies = {};
  if (!cookieString) return cookies;

  cookieString.split(';').forEach(cookie => {
    const parts = cookie.split('=');
    const key = parts[0].trim();
    const value = parts[1] ? parts[1].trim() : '';
    cookies[key] = value;
  });

  return cookies;
}
