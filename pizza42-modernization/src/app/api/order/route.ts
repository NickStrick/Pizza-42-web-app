import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';

const REQUIRED_SCOPE = 'place:orders';

export async function POST(request: Request) {
  try {
    // 1. Require a valid session (the user must be logged in).
    const session = await auth0.getSession();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized: Missing valid session' },
        { status: 401 }
      );
    }

    const { user } = session;

    // 2. Require a verified email before an order can be placed.
    if (!user.email_verified) {
      return NextResponse.json(
        { error: 'Forbidden: Email address must be verified to place an order' },
        { status: 403 }
      );
    }

    // 3. Require a valid Access Token carrying the `place:orders` scope.
    //    This is the actual API-protection check: it isn't enough to be
    //    logged in, the token issued for this API must include the
    //    permission configured on the Auth0 API + the user's role.
    let scope: string | undefined;
    try {
      const tokenResult = await auth0.getAccessToken();
      scope = tokenResult.scope;
    } catch (err) {
      console.error('[api/order] Failed to retrieve access token:', err);
      return NextResponse.json(
        {
          error:
            'Forbidden: No access token available for the Pizza 42 Ordering API. ' +
            'Confirm AUTH0_AUDIENCE is set and the API/permission is configured in Auth0.',
        },
        { status: 403 }
      );
    }

    const grantedScopes = scope?.split(' ') ?? [];
    if (!grantedScopes.includes(REQUIRED_SCOPE)) {
      return NextResponse.json(
        { error: `Forbidden: Missing required permission "${REQUIRED_SCOPE}"` },
        { status: 403 }
      );
    }

    // 4. Validate the order payload.
    const body = await request.json();
    const { items, total } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Bad Request: Cart is empty' }, { status: 400 });
    }

    // 5. Build the order record.
    const newOrder = {
      orderId: `p42_${Math.random().toString(36).substring(2, 11)}`,
      date: new Date().toISOString(),
      items,
      total,
    };

    // 6. Persist the order to the user's profile (app_metadata).
    //    Per the challenge FAQ, a full backend isn't required for this PoC.
    //    A real implementation would call the Auth0 Management API here:
    //      PATCH https://{domain}/api/v2/users/{user.sub}
    //      { app_metadata: { orders: [...existing, newOrder] } }
    //    using a Management API token (client_credentials grant against a
    //    separate M2M application authorized for the Management API).
    console.log(`[Auth0 Management API Sync] Appending order to user ${user.sub}:`, newOrder);

    return NextResponse.json(
      {
        success: true,
        message: 'Pizza 42 order placed successfully!',
        order: newOrder,
      },
      { status: 200 }
    );
  } catch (error) {
    const details = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Internal Server Error', details }, { status: 500 });
  }
}
