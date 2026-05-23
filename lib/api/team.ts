import { API_BASE, MERCHANT_SLUG, TEAM_SLUG } from './config';

export async function registerTeam() {
  const res = await fetch(`${API_BASE}/teams`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      slug: TEAM_SLUG,
      name: 'Mensah Solo',
      merchant_id: MERCHANT_SLUG,
      contact: 'mensah@example.com',
    }),
  });

  if (res.status === 409) {
    return; // already registered
  }
  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Team registration failed: ${err.message}`);
  }
  return res.json();
}

export async function getTeamData() {
  const res = await fetch(`${API_BASE}/teams/${TEAM_SLUG}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  return res.json();
}
