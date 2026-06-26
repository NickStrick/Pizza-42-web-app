import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { appendOrderToUserProfile } from '@/lib/auth0-management';

const REQUIRED_SCOPE = 'place:orders';

export async function POST(request: Request) {
  try {
    // Requirement 1: must be logged in.
    const session = await auth0.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized: missing valid session' }, { status: 401 });
    }
    const { user } = session;

    // Requirement 3: verified email is required to order, but not to log in.
    if (!user.email_verified) {
      return NextResponse.json(
        { error: 'Forbidden: email address must be verified to place an order' },
        { status: 403 }
      );
    }

    // Requirement 2: a valid session isn't enough on its own — the access
    // token issued for this API must also carry the place:orders permission.
    const { scope } = await auth0.getAccessToken();
    if (!scope?.split(' ').includes(REQUIRED_SCOPE)) {
      // TEMPORARY DEBUG: echo back the actual scope string we received so we
      // can see what the token contains without manually decoding a JWT.
      // Remove the `receivedScope` field once place:orders shows up here.
      return NextResponse.json(
        {
          error: `Forbidden: missing required permission "${REQUIRED_SCOPE}"`,
          receivedScope: scope ?? '(none)',
          // Compare this against the "user_id" shown on the dashboard's user
          // detail page — if they don't match, the permission was assigned
          // to a different Auth0 user record than the one you're logged in as.
          loggedInAsUserId: user.sub,
        },
        { status: 403 }
      );
    }

    const { items, total } = await request.json();
    if (!items?.length) {
      return NextResponse.json({ error: 'Bad Request: cart is empty' }, { status: 400 });
    }

    const order = {
      orderId: `p42_${Math.random().toString(36).substring(2, 11)}`,
      date: new Date().toISOString(),
      items,
      total,
    };

    // Requirement 4: persist the order into the user's app_metadata.
    await appendOrderToUserProfile(user.sub, order);

    return NextResponse.json(
      { success: true, message: 'Pizza 42 order placed successfully!', order },
      { status: 200 }
    );
  } catch (error) {
    // Covers a missing/expired access token (no AUTH0_AUDIENCE configured),
    // a Management API failure, or any other unexpected error.
    console.error('[api/order]', error);
    const details = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Internal Server Error', details }, { status: 500 });
  }
}
