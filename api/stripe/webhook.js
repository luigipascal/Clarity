// POST /api/stripe/webhook
// Handles Stripe webhook events (payment succeeded, etc.)

export const config = {
  api: {
    bodyParser: false // Required for Stripe signature verification
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const Stripe = require('stripe');
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  // Get raw body for signature verification
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const rawBody = Buffer.concat(chunks).toString('utf8');

  // Verify webhook signature
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: 'Webhook signature verification failed' });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutComplete(event.data.object);
      break;

    case 'payment_intent.succeeded':
      // Already handled by checkout.session.completed
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return res.status(200).json({ received: true });
}

async function handleCheckoutComplete(session) {
  const Airtable = require('airtable');
  const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
    .base(process.env.AIRTABLE_BASE_ID);

  const email = session.customer_email || session.customer_details?.email;
  const tier = session.metadata?.tier;

  if (!email || !tier) {
    console.error('Missing email or tier in session:', session.id);
    return;
  }

  // Generate license key
  const licenseKey = generateLicenseKey(tier);

  // Calculate updates expiry (1 year for starter/pro, lifetime for agency)
  const updatesUntil = tier === 'agency'
    ? new Date('2099-12-31').toISOString() // "Lifetime"
    : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(); // 1 year

  try {
    // Find or create user
    let user = await findUserByEmail(base, email);

    if (user) {
      // Update existing user
      await base('Clarity_Users').update([
        {
          id: user.id,
          fields: {
            license_tier: tier,
            license_key: licenseKey,
            purchased_at: new Date().toISOString(),
            updates_until: updatesUntil,
            stripe_customer_id: session.customer || null
          }
        }
      ]);
    } else {
      // Create new user
      await base('Clarity_Users').create([
        {
          fields: {
            email: email.toLowerCase(),
            license_tier: tier,
            license_key: licenseKey,
            purchased_at: new Date().toISOString(),
            updates_until: updatesUntil,
            stripe_customer_id: session.customer || null,
            created_at: new Date().toISOString()
          }
        }
      ]);
    }

    // Send license key email
    await sendLicenseEmail(email, tier, licenseKey);

    console.log(`License created for ${email}: ${tier} (${licenseKey})`);

  } catch (error) {
    console.error('Failed to create license:', error);
    throw error;
  }
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

function generateLicenseKey(tier) {
  const prefix = tier.toUpperCase().substring(0, 3);
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No confusing chars
  let key = prefix + '-';

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    if (i < 3) key += '-';
  }

  return key; // Format: STA-XXXX-XXXX-XXXX-XXXX
}

async function sendLicenseEmail(email, tier, licenseKey) {
  const tierNames = {
    starter: 'Starter',
    pro: 'Pro',
    agency: 'Agency'
  };

  await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': process.env.BREVO_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      templateId: parseInt(process.env.BREVO_TEMPLATE_LICENSE_KEY || '40'),
      to: [{ email: email }],
      params: {
        EMAIL: email,
        TIER: tierNames[tier] || tier,
        LICENSE_KEY: licenseKey,
        APP_URL: process.env.APP_URL
      }
    })
  });
}
