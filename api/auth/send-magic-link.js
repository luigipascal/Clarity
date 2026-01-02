// POST /api/auth/send-magic-link
// Sends a magic link email to the user for passwordless authentication

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  // Validate email
  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  try {
    // Generate a secure token
    const token = generateToken();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Store in Airtable
    const Airtable = require('airtable');
    const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
      .base(process.env.AIRTABLE_BASE_ID);

    await base('Clarity_MagicLinks').create([
      {
        fields: {
          email: email.toLowerCase(),
          token: token,
          expires_at: expiresAt.toISOString(),
          used: false
        }
      }
    ]);

    // Send magic link via Brevo
    const magicLinkUrl = `${process.env.APP_URL}/api/auth/verify-magic-link?token=${token}`;

    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        templateId: parseInt(process.env.BREVO_TEMPLATE_MAGIC_LINK || '37'),
        to: [{ email: email.toLowerCase() }],
        params: {
          MAGIC_LINK: magicLinkUrl,
          EMAIL: email
        }
      })
    });

    return res.status(200).json({
      success: true,
      message: 'Magic link sent! Check your email.'
    });

  } catch (error) {
    console.error('Magic link error:', error);
    return res.status(500).json({ error: 'Failed to send magic link' });
  }
}

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function generateToken() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 64; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}
