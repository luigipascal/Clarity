// GET /api/sync/load?project_id=xxx
// Loads a specific project from Airtable

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { project_id } = req.query;

  if (!project_id) {
    return res.status(400).json({ error: 'project_id is required' });
  }

  // Get session
  const cookies = parseCookies(req.headers.cookie || '');
  const sessionToken = cookies.clarity_session;

  if (!sessionToken) {
    return res.status(401).json({ error: 'Authentication required' });
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

    // Get project
    const project = await base('Clarity_Projects').find(project_id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check ownership or sharing
    const isOwner = project.fields.user_id && project.fields.user_id[0] === user.id;
    const isShared = project.fields.shared_with && project.fields.shared_with.includes(user.id);

    if (!isOwner && !isShared) {
      return res.status(403).json({ error: 'Access denied to this project' });
    }

    // Parse project data
    let data;
    try {
      data = JSON.parse(project.fields.data || '{}');
    } catch (e) {
      data = {};
    }

    return res.status(200).json({
      success: true,
      project: {
        id: project.id,
        name: project.fields.name,
        data: data,
        created_at: project.fields.created_at,
        updated_at: project.fields.updated_at,
        is_owner: isOwner
      }
    });

  } catch (error) {
    console.error('Load project error:', error);
    if (error.statusCode === 404) {
      return res.status(404).json({ error: 'Project not found' });
    }
    return res.status(500).json({ error: 'Failed to load project' });
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
