import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { getMenuFromS3, putMenuToS3 } from '@/lib/s3';
import { PIZZA_CHEF_ROLE, ROLES_CLAIM } from '@/lib/claims';

export async function GET() {
  const menu = await getMenuFromS3();
  return NextResponse.json({ menu });
}

export async function PUT(request: Request) {
  const session = await auth0.getSession();
  const roles: string[] = session?.user?.[ROLES_CLAIM] ?? [];

  if (!session?.user || !roles.includes(PIZZA_CHEF_ROLE)) {
    return NextResponse.json(
      { error: `Forbidden: requires the "${PIZZA_CHEF_ROLE}" role` },
      { status: 403 }
    );
  }

  const { id, available } = await request.json();
  if (typeof id !== 'string' || typeof available !== 'boolean') {
    return NextResponse.json(
      { error: 'Bad Request: expected { id: string, available: boolean }' },
      { status: 400 }
    );
  }

  // Patch a single item against a freshly-read copy of the menu, rather than
  // accepting a client-supplied full menu array — the client's copy may be
  // stale (e.g. orders placed since the dashboard loaded), and overwriting
  // the whole document would silently wipe out fields like totalOrdered.
  const menu = await getMenuFromS3();
  const updatedMenu = menu.map((item) => (item.id === id ? { ...item, available } : item));
  await putMenuToS3(updatedMenu);

  return NextResponse.json({ success: true, menu: updatedMenu });
}
