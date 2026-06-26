import { Auth0Client } from '@auth0/nextjs-auth0/server';

export const auth0 = new Auth0Client({
  authorizationParameters: {
    audience: process.env.AUTH0_AUDIENCE,
    scope: 'openid profile email offline_access place:orders',
  },
  // Without this, the SDK strips session.user down to a fixed whitelist of
  // standard OIDC claims, silently dropping the order_history claim our
  // Login Action adds to the ID token. `session.user` here is still the
  // full, unfiltered ID token claims, so returning it as-is keeps everything.
  async beforeSessionSaved(session) {
    return session;
  },
});
