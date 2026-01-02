// POST /api/newsletter/subscribe
// Securely subscribes a user to the newsletter via Brevo

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  // Validate email
  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  try {
    // Add contact to Brevo list
    const contactRes = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email.toLowerCase(),
        listIds: [parseInt(process.env.BREVO_NEWSLETTER_LIST_ID || '16')],
        updateEnabled: true
      })
    });

    const contactData = await contactRes.json().catch(() => ({}));

    // Check for duplicate
    if (contactData.code === 'duplicate_parameter') {
      return res.status(200).json({
        success: true,
        message: "You're already subscribed!",
        duplicate: true
      });
    }

    // Check for other errors
    if (!contactRes.ok && contactRes.status !== 201 && contactRes.status !== 204) {
      throw new Error(contactData.message || 'Failed to subscribe');
    }

    // Send welcome email
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        templateId: 36, // Existing newsletter welcome template
        to: [{ email: email.toLowerCase() }],
        params: {
          EMAIL: email
        }
      })
    });

    return res.status(200).json({
      success: true,
      message: 'Subscribed! Check your email.',
      duplicate: false
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return res.status(500).json({ error: 'Subscription failed. Please try again.' });
  }
}

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}
