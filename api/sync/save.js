// POST /api/sync/save
// Saves a project to Airtable (requires Starter+ license)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get session
  const cookies = parseCookies(req.headers.cookie || '');
  const sessionToken = cookies.clarity_session;

  if (!sessionToken) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const { project_id, name, data } = req.body;

  if (!name || !data) {
    return res.status(400).json({ error: 'Project name and data are required' });
  }

  try {
    const Airtable = require('airtable');
    const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
      .base(process.env.AIRTABLE_BASE_ID);

    // Verify session and get user
    const user = await getUserFromSession(base, sessionToken);
    if (!user) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    // Check license tier
    const tier = user.fields.license_tier || 'free';
    if (tier === 'free') {
      return res.status(403).json({
        error: 'Cloud sync requires Starter license or higher',
        upgrade_required: true
      });
    }

    // Check project limits
    const projectLimit = tier === 'starter' ? 10 : -1;
    if (projectLimit > 0 && !project_id) {
      const existingProjects = await base('Clarity_Projects')
        .select({
          filterByFormula: `{user_id} = '${user.id}'`
        })
        .firstPage();

      if (existingProjects.length >= projectLimit) {
        return res.status(403).json({
          error: `Project limit reached (${projectLimit}). Upgrade to Pro for unlimited projects.`,
          upgrade_required: true
        });
      }
    }

    let savedProject;

    if (project_id) {
      // Update existing project
      const existing = await base('Clarity_Projects').find(project_id);
      if (!existing || existing.fields.user_id[0] !== user.id) {
        return res.status(404).json({ error: 'Project not found' });
      }

      savedProject = await base('Clarity_Projects').update([
        {
          id: project_id,
          fields: {
            name: name,
            data: JSON.stringify(data),
            updated_at: new Date().toISOString()
          }
        }
      ]);
    } else {
      // Create new project
      savedProject = await base('Clarity_Projects').create([
        {
          fields: {
            user_id: [user.id],
            name: name,
            data: JSON.stringify(data),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        }
      ]);
    }

    return res.status(200).json({
      success: true,
      project_id: savedProject[0].id,
      message: project_id ? 'Project updated' : 'Project saved'
    });

  } catch (error) {
    console.error('Save project error:', error);
    return res.status(500).json({ error: 'Failed to save project' });
  }
}

async function getUserFromSession(base, sessionToken) {
  const sessions = await base('Clarity_Sessions')
    .select({
      filterByFormula: `{token} = '${sessionToken}'`,
      maxRecords: 1
    })
    .firstPage();

  if (sessions.length === 0) return null;

  const session = sessions[0];
  const expiresAt = new Date(session.fields.expires_at);
  if (expiresAt < new Date()) return null;

  const userId = session.fields.user_id[0];
  return await base('Clarity_Users').find(userId);
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
