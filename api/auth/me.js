// GET /api/auth/me
// Returns the current user's session and license info

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get session token from cookie
  const cookies = parseCookies(req.headers.cookie || '');
  const sessionToken = cookies.clarity_session;

  if (!sessionToken) {
    return res.status(200).json({
      authenticated: false,
      user: null
    });
  }

  try {
    const Airtable = require('airtable');
    const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
      .base(process.env.AIRTABLE_BASE_ID);

    // Find session
    const sessions = await base('Clarity_Sessions')
      .select({
        filterByFormula: `{token} = '${sessionToken}'`,
        maxRecords: 1
      })
      .firstPage();

    if (sessions.length === 0) {
      return res.status(200).json({
        authenticated: false,
        user: null
      });
    }

    const session = sessions[0];
    const expiresAt = new Date(session.fields.expires_at);

    // Check if session expired
    if (expiresAt < new Date()) {
      // Clean up expired session
      await base('Clarity_Sessions').destroy([session.id]);
      return res.status(200).json({
        authenticated: false,
        user: null
      });
    }

    // Get user
    const userId = session.fields.user_id[0];
    const user = await base('Clarity_Users').find(userId);

    return res.status(200).json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.fields.email,
        name: user.fields.name || null,
        license_tier: user.fields.license_tier || 'free',
        license_key: user.fields.license_key || null,
        updates_until: user.fields.updates_until || null,
        device_count: user.fields.device_count || 0
      }
    });

  } catch (error) {
    console.error('Auth check error:', error);
    return res.status(500).json({ error: 'Authentication check failed' });
  }
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
