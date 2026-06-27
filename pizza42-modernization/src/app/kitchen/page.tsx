import { auth0 } from "@/lib/auth0";
import { PIZZA_CHEF_ROLE, ROLES_CLAIM } from "@/lib/claims";
import { getMenuFromS3 } from "@/lib/s3";
import KitchenMenuEditor from "@/components/KitchenMenuEditor";
import { ChefAccessDenied, SignInRequired } from "@/components/ChefAccessDenied";

export default async function KitchenDashboard() {
  const session = await auth0.getSession();
  const user = session?.user;

  if (!user) {
    return <SignInRequired pageLabel="kitchen dashboard" />;
  }

  const roles: string[] = user[ROLES_CLAIM] ?? [];
  const isChef = roles.includes(PIZZA_CHEF_ROLE);

  if (!isChef) {
    return <ChefAccessDenied pageLabel="Kitchen Dashboard" />;
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
