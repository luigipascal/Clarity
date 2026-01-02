// Run with: node scripts/create-brevo-templates.js
// Requires BREVO_API_KEY in .env.local or as environment variable

require('dotenv').config({ path: '.env.local' });

const BREVO_API_KEY = process.env.BREVO_API_KEY;

if (!BREVO_API_KEY) {
  console.error('ERROR: BREVO_API_KEY not found in .env.local');
  process.exit(1);
}

const templates = [
  {
    name: 'Clarity - Magic Link Login',
    subject: 'Sign in to Berta1Clarity',
    htmlContent: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0a0b; color: #e5e5e5; padding: 40px 20px; margin: 0; }
    .container { max-width: 500px; margin: 0 auto; background: #18181b; border-radius: 12px; padding: 40px; }
    h1 { color: #e8c547; margin: 0 0 20px; font-size: 24px; }
    p { line-height: 1.6; margin: 0 0 20px; }
    .button { display: inline-block; background: #e8c547; color: #0a0a0b; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #333; font-size: 13px; color: #888; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Sign in to Clarity</h1>
    <p>Click the button below to sign in to your account. This link expires in 15 minutes.</p>
    <p><a href="{{ params.MAGIC_LINK }}" class="button">Sign In</a></p>
    <p class="footer">If you didn't request this, you can safely ignore this email.<br>— Berta1 Team</p>
  </div>
</body>
</html>`,
    envVar: 'BREVO_TEMPLATE_MAGIC_LINK'
  },
  {
    name: 'Clarity - Welcome',
    subject: 'Welcome to Berta1Clarity',
    htmlContent: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0a0b; color: #e5e5e5; padding: 40px 20px; margin: 0; }
    .container { max-width: 500px; margin: 0 auto; background: #18181b; border-radius: 12px; padding: 40px; }
    h1 { color: #e8c547; margin: 0 0 20px; font-size: 24px; }
    p { line-height: 1.6; margin: 0 0 20px; }
    .button { display: inline-block; background: #e8c547; color: #0a0a0b; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; }
    .features { background: #222; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .features ul { margin: 10px 0 0 0; padding-left: 20px; }
    .features li { margin: 8px 0; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #333; font-size: 13px; color: #888; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Welcome to Clarity!</h1>
    <p>Your account has been created. You're now ready to think more clearly.</p>
    <div class="features">
      <strong>What you can do:</strong>
      <ul>
        <li>Break down complex problems</li>
        <li>Organize your thoughts visually</li>
        <li>Get AI-powered insights</li>
      </ul>
    </div>
    <p><a href="https://clarity.berta.one" class="button">Open Clarity</a></p>
    <p class="footer">Questions? Reply to this email.<br>— Berta1 Team</p>
  </div>
</body>
</html>`,
    envVar: 'BREVO_TEMPLATE_WELCOME'
  },
  {
    name: 'Clarity - License Purchased',
    subject: 'Your Berta1Clarity {{ params.TIER }} License',
    htmlContent: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0a0b; color: #e5e5e5; padding: 40px 20px; margin: 0; }
    .container { max-width: 500px; margin: 0 auto; background: #18181b; border-radius: 12px; padding: 40px; }
    h1 { color: #e8c547; margin: 0 0 20px; font-size: 24px; }
    p { line-height: 1.6; margin: 0 0 20px; }
    .tier-badge { display: inline-block; background: #e8c547; color: #0a0a0b; padding: 6px 14px; border-radius: 20px; font-weight: 600; font-size: 14px; }
    .button { display: inline-block; background: #e8c547; color: #0a0a0b; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #333; font-size: 13px; color: #888; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Thank You for Your Purchase!</h1>
    <p>Your <span class="tier-badge">{{ params.TIER }}</span> license is now active.</p>
    <p>Your license key will arrive in a separate email shortly.</p>
    <p><a href="https://clarity.berta.one/account" class="button">View Account</a></p>
    <p class="footer">Need help? Reply to this email.<br>— Berta1 Team</p>
  </div>
</body>
</html>`,
    envVar: 'BREVO_TEMPLATE_LICENSE_PURCHASED'
  },
  {
    name: 'Clarity - License Key',
    subject: 'Your Berta1Clarity License Key',
    htmlContent: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0a0b; color: #e5e5e5; padding: 40px 20px; margin: 0; }
    .container { max-width: 500px; margin: 0 auto; background: #18181b; border-radius: 12px; padding: 40px; }
    h1 { color: #e8c547; margin: 0 0 20px; font-size: 24px; }
    p { line-height: 1.6; margin: 0 0 20px; }
    .tier-badge { display: inline-block; background: #e8c547; color: #0a0a0b; padding: 6px 14px; border-radius: 20px; font-weight: 600; font-size: 14px; }
    .license-box { background: #0a0a0b; border: 2px solid #e8c547; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
    .license-key { font-family: monospace; font-size: 18px; color: #e8c547; letter-spacing: 1px; word-break: break-all; }
    .button { display: inline-block; background: #e8c547; color: #0a0a0b; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #333; font-size: 13px; color: #888; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Your License Key</h1>
    <p>Here's your <span class="tier-badge">{{ params.TIER }}</span> license key:</p>
    <div class="license-box">
      <div class="license-key">{{ params.LICENSE_KEY }}</div>
    </div>
    <p>Keep this email safe. You'll need this key to activate your license.</p>
    <p><a href="{{ params.APP_URL }}/account" class="button">Go to Account</a></p>
    <p class="footer">This key is linked to {{ params.EMAIL }}<br>— Berta1 Team</p>
  </div>
</body>
</html>`,
    envVar: 'BREVO_TEMPLATE_LICENSE_KEY'
  }
];

async function createTemplate(template) {
  const response = await fetch('https://api.brevo.com/v3/smtp/templates', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'api-key': BREVO_API_KEY
    },
    body: JSON.stringify({
      sender: {
        name: 'Berta1 Clarity',
        email: 'noreply@berta.one'
      },
      templateName: template.name,
      subject: template.subject,
      htmlContent: template.htmlContent,
      isActive: true
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create "${template.name}": ${error}`);
  }

  const data = await response.json();
  return data.id;
}

async function main() {
  console.log('Creating Brevo email templates...\n');

  const results = [];

  for (const template of templates) {
    try {
      const id = await createTemplate(template);
      console.log(`✅ ${template.name} → ID: ${id}`);
      results.push({ envVar: template.envVar, id });
    } catch (error) {
      console.error(`❌ ${template.name}: ${error.message}`);
    }
  }

  console.log('\n----------------------------------------');
  console.log('Add these to your .env.local:\n');
  results.forEach(r => {
    console.log(`${r.envVar}=${r.id}`);
  });
  console.log('----------------------------------------\n');
}

main().catch(console.error);
