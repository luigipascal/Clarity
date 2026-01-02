// POST /api/license/check
// Validates a license key and returns the associated tier

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { license_key, email } = req.body;

  if (!license_key && !email) {
    return res.status(400).json({ error: 'License key or email is required' });
  }

  try {
    const Airtable = require('airtable');
    const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
      .base(process.env.AIRTABLE_BASE_ID);

    let filterFormula;
    if (license_key) {
      filterFormula = `{license_key} = '${license_key}'`;
    } else {
      filterFormula = `{email} = '${email.toLowerCase()}'`;
    }

    const users = await base('Clarity_Users')
      .select({
        filterByFormula: filterFormula,
        maxRecords: 1
      })
      .firstPage();

    if (users.length === 0) {
      return res.status(200).json({
        valid: false,
        tier: 'free',
        message: license_key ? 'Invalid license key' : 'No license found for this email'
      });
    }

    const user = users[0];
    const tier = user.fields.license_tier || 'free';
    const updatesUntil = user.fields.updates_until ? new Date(user.fields.updates_until) : null;
    const now = new Date();

    // Check if updates have expired (still valid license, just no updates)
    const updatesExpired = updatesUntil && updatesUntil < now;

    // Get tier limits
    const tierLimits = {
      free: { projects: 3, devices: 1, cloudSync: false, pdfExport: false, aiSummary: false, team: false },
      starter: { projects: 10, devices: 1, cloudSync: true, pdfExport: true, aiSummary: false, team: false },
      pro: { projects: -1, devices: 3, cloudSync: true, pdfExport: true, aiSummary: true, team: false },
      agency: { projects: -1, devices: -1, cloudSync: true, pdfExport: true, aiSummary: true, team: true }
    };

    const limits = tierLimits[tier] || tierLimits.free;

    return res.status(200).json({
      valid: tier !== 'free',
      tier: tier,
      email: user.fields.email,
      license_key: user.fields.license_key || null,
      purchased_at: user.fields.purchased_at || null,
      updates_until: user.fields.updates_until || null,
      updates_expired: updatesExpired,
      limits: limits,
      message: tier === 'free' ? 'Free tier' : `${tier.charAt(0).toUpperCase() + tier.slice(1)} license active`
    });

  } catch (error) {
    console.error('License check error:', error);
    return res.status(500).json({ error: 'License check failed' });
  }
}
