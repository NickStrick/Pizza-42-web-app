// Thin client for the Auth0 Management API, used to persist order history
// into a user's app_metadata (Phase 1, Requirement 4).

const domain = process.env.AUTH0_DOMAIN;

// fetch() doesn't throw on HTTP error responses, so every call site would
// otherwise need its own `if (!res.ok) throw ...` block. Centralizing that
// here keeps the two API calls below short and consistent.
async function requestJson(url: string, init?: RequestInit) {
  const res = await fetch(url, init);
  if (!res.ok) {
    throw new Error(`Auth0 API request failed (${res.status}): ${await res.text()}`);
  }
  return res.json();
}

let cachedToken: { token: string; expiresAt: number } | null = null;

// M2M tokens are valid for hours, so we cache in memory and only re-request
// once expired instead of authenticating on every order.
async function getManagementToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token;
  }

  const clientId = process.env.AUTH0_MGMT_CLIENT_ID;
  const clientSecret = process.env.AUTH0_MGMT_CLIENT_SECRET;
  if (!domain || !clientId || !clientSecret) {
    throw new Error(
      'Missing Management API credentials: set AUTH0_DOMAIN, AUTH0_MGMT_CLIENT_ID, and AUTH0_MGMT_CLIENT_SECRET'
    );
  }

  const data = await requestJson(`https://${domain}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      audience: `https://${domain}/api/v2/`,
    }),
  });

  // Refresh a minute early so we never use a token that expires mid-request.
  cachedToken = { token: data.access_token, expiresAt: Date.now() + (data.expires_in - 60) * 1000 };
  return cachedToken.token;
}

import type { OrderHistoryEntry as Order } from './claims';
export type { OrderHistoryEntry as Order } from './claims';

// Appends `order` to the user's existing order history in app_metadata.
// Read-then-write (rather than a blind overwrite) so concurrent orders
// don't clobber each other's history.
export async function appendOrderToUserProfile(userId: string, order: Order): Promise<Order[]> {
  const token = await getManagementToken();
  const authHeader = { Authorization: `Bearer ${token}` };
  const userUrl = `https://${domain}/api/v2/users/${encodeURIComponent(userId)}`;

  const existingUser = await requestJson(`${userUrl}?fields=app_metadata`, { headers: authHeader });
  const updatedOrders: Order[] = [...(existingUser.app_metadata?.orders ?? []), order];

  await requestJson(userUrl, {
    method: 'PATCH',
    headers: { ...authHeader, 'Content-Type': 'application/json' },
    body: JSON.stringify({ app_metadata: { orders: updatedOrders } }),
  });

  return updatedOrders;
}
