// GET /api/auth/verify-magic-link?token=xxx
// Verifies the magic link token and creates a session

export default async function handler(req, res) {
  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.query;

  if (!token) {
    return redirectWithError(res, 'Invalid or missing token');
  }

  try {
    const Airtable = require('airtable');
    const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
      .base(process.env.AIRTABLE_BASE_ID);

    // Find the magic link
    const records = await base('Clarity_MagicLinks')
      .select({
        filterByFormula: `AND({token} = '${token}', {used} = FALSE())`,
        maxRecords: 1
      })
      .firstPage();

    if (records.length === 0) {
      return redirectWithError(res, 'Invalid or expired link');
    }

    const magicLink = records[0];
    const expiresAt = new Date(magicLink.fields.expires_at);

    // Check if expired
    if (expiresAt < new Date()) {
      return redirectWithError(res, 'This link has expired. Please request a new one.');
    }

    // Mark as used
    await base('Clarity_MagicLinks').update([
      { id: magicLink.id, fields: { used: true } }
    ]);

    const email = magicLink.fields.email;

    // Find or create user
    let user = await findUserByEmail(base, email);
    if (!user) {
      user = await createUser(base, email);
    }

    // Create session
    const sessionToken = generateToken();
    const sessionExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    await base('Clarity_Sessions').create([
      {
        fields: {
          user_id: [user.id],
          token: sessionToken,
          expires_at: sessionExpiry.toISOString()
        }
      }
    ]);

    // Set session cookie and redirect to app
    res.setHeader('Set-Cookie', [
      `clarity_session=${sessionToken}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${30 * 24 * 60 * 60}`
    ]);

    // Redirect to app with success
    return res.redirect(302, `${process.env.APP_URL}/clarity-engine-v2.html?login=success`);

  } catch (error) {
    console.error('Verify magic link error:', error);
    return redirectWithError(res, 'Something went wrong. Please try again.');
  }
}

function redirectWithError(res, message) {
  return res.redirect(302, `${process.env.APP_URL}/login.html?error=${encodeURIComponent(message)}`);
}

async function findUserByEmail(base, email) {
  const records = await base('Clarity_Users')
    .select({
      filterByFormula: `{email} = '${email.toLowerCase()}'`,
      maxRecords: 1
    })
    .firstPage();

  return records.length > 0 ? records[0] : null;
}

async function createUser(base, email) {
  const records = await base('Clarity_Users').create([
    {
      fields: {
        email: email.toLowerCase(),
        license_tier: 'free',
        created_at: new Date().toISOString()
      }
    }
  ]);

  // Send welcome email
  await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': process.env.BREVO_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      templateId: parseInt(process.env.BREVO_TEMPLATE_WELCOME || '38'),
      to: [{ email: email.toLowerCase() }],
      params: { EMAIL: email }
    })
  });

  return records[0];
}

function generateToken() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 64; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}
