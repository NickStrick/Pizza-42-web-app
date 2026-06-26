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

  const { menu } = await request.json();
  if (!Array.isArray(menu)) {
    return NextResponse.json({ error: 'Bad Request: expected { menu: MenuItem[] }' }, { status: 400 });
  }

  await putMenuToS3(menu);
  return NextResponse.json({ success: true, menu });
}
