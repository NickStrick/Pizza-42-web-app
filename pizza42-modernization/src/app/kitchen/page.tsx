import { auth0 } from "@/lib/auth0";
import { PIZZA_CHEF_ROLE, ROLES_CLAIM } from "@/lib/claims";
import { getMenuFromS3 } from "@/lib/s3";
import KitchenMenuEditor from "@/components/KitchenMenuEditor";

export default async function KitchenDashboard() {
  const session = await auth0.getSession();
  const user = session?.user;

  if (!user) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <h1 className="mb-2 text-xl font-bold text-gray-900">Sign in required</h1>
        <p className="text-sm text-gray-500">Sign in with a Pizza Chef account to view the kitchen dashboard.</p>
      </main>
    );
  }

  const roles: string[] = user[ROLES_CLAIM] ?? [];
  const isChef = roles.includes(PIZZA_CHEF_ROLE);

  if (!isChef) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-2xl">
          🔒
        </div>
        <h1 className="mb-2 text-xl font-bold text-gray-900">Access denied</h1>
        <p className="text-sm text-gray-500">
          The Kitchen Dashboard is only available to staff with the &ldquo;{PIZZA_CHEF_ROLE}&rdquo; role.
        </p>
      </main>
    );
  }

  const menu = await getMenuFromS3();

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="mb-1 text-2xl font-bold text-gray-900">🍕 Kitchen Dashboard</h1>
      <p className="mb-6 text-sm text-gray-500">
        Welcome, {user.name ?? "chef"}. Toggle items in real time — no deploy required.
      </p>

      <KitchenMenuEditor initialMenu={menu} />
    </main>
  );
}
