// GET /api/sync/list
// Lists all projects for the current user

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
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

    // Get user's own projects
    const ownProjects = await base('Clarity_Projects')
      .select({
        filterByFormula: `FIND('${user.id}', ARRAYJOIN({user_id}))`,
        sort: [{ field: 'updated_at', direction: 'desc' }]
      })
      .all();

    // Get shared projects (if any)
    const sharedProjects = await base('Clarity_Projects')
      .select({
        filterByFormula: `FIND('${user.id}', ARRAYJOIN({shared_with}))`,
        sort: [{ field: 'updated_at', direction: 'desc' }]
      })
      .all();

    const formatProject = (project, isOwner) => ({
      id: project.id,
      name: project.fields.name,
      created_at: project.fields.created_at,
      updated_at: project.fields.updated_at,
      is_owner: isOwner
    });

    const projects = [
      ...ownProjects.map(p => formatProject(p, true)),
      ...sharedProjects.map(p => formatProject(p, false))
    ];

    // Get tier limits
    const tier = user.fields.license_tier || 'free';
    const projectLimit = tier === 'free' ? 3 : tier === 'starter' ? 10 : -1;

    return res.status(200).json({
      success: true,
      projects: projects,
      total: projects.length,
      limit: projectLimit,
      can_create: projectLimit === -1 || projects.filter(p => p.is_owner).length < projectLimit
    });

  } catch (error) {
    console.error('List projects error:', error);
    return res.status(500).json({ error: 'Failed to list projects' });
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
