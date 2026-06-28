import { Auth0Client } from '@auth0/nextjs-auth0/server';
import { ORDER_HISTORY_CLAIM, type OrderHistoryEntry } from './claims';

// Order history is unbounded in app_metadata, but the session cookie isn't —
// keeping every order ever placed in the cookie eventually blows past the
// browser/server request header size limit (HTTP 431). Only the most recent
// orders are ever shown in the UI anyway, so capping here is lossless in
// practice.
const MAX_ORDERS_IN_SESSION = 20;

export const auth0 = new Auth0Client({
  authorizationParameters: {
    audience: process.env.AUTH0_AUDIENCE,
    scope: 'openid profile email offline_access place:orders',
  },
  // Without this, the SDK strips session.user down to a fixed whitelist of
  // standard OIDC claims, silently dropping the order_history claim our
  // Login Action adds to the ID token. `session.user` here is still the
  // full, unfiltered ID token claims, so we keep everything except for
  // capping order_history, which is the one claim that grows without bound.
  async beforeSessionSaved(session) {
    const orderHistory = session.user[ORDER_HISTORY_CLAIM] as OrderHistoryEntry[] | undefined;
    if (!orderHistory || orderHistory.length <= MAX_ORDERS_IN_SESSION) {
      return session;
    }

    return {
      ...session,
      user: {
        ...session.user,
        [ORDER_HISTORY_CLAIM]: orderHistory.slice(-MAX_ORDERS_IN_SESSION),
      },
    };
  },
});
