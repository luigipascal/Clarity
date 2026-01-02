// POST /api/stripe/create-checkout
// Creates a Stripe checkout session for one-time license purchase

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { tier, email } = req.body;

  // Validate tier
  const validTiers = ['starter', 'pro', 'agency'];
  if (!tier || !validTiers.includes(tier)) {
    return res.status(400).json({ error: 'Invalid tier. Must be starter, pro, or agency.' });
  }

  // Get price ID for tier
  const priceIds = {
    starter: process.env.STRIPE_STARTER_PRICE_ID,
    pro: process.env.STRIPE_PRO_PRICE_ID,
    agency: process.env.STRIPE_AGENCY_PRICE_ID
  };

  const priceId = priceIds[tier];
  if (!priceId) {
    return res.status(500).json({ error: 'Price not configured for this tier.' });
  }

  try {
    const Stripe = require('stripe');
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      customer_email: email || undefined,
      metadata: {
        tier: tier,
        product: 'clarity'
      },
      success_url: `${process.env.APP_URL}/account.html?purchase=success&tier=${tier}`,
      cancel_url: `${process.env.APP_URL}/pricing.html?purchase=cancelled`
    });

    return res.status(200).json({
      success: true,
      sessionId: session.id,
      url: session.url
    });

  } catch (error) {
    console.error('Stripe checkout error:', error);
    return res.status(500).json({ error: 'Failed to create checkout session.' });
  }
}
