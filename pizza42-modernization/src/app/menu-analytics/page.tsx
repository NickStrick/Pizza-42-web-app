import { auth0 } from "@/lib/auth0";
import { PIZZA_CHEF_ROLE, ROLES_CLAIM } from "@/lib/claims";
import { getMenuFromS3 } from "@/lib/s3";
import MenuAnalyticsChart from "@/components/MenuAnalyticsChart";
import { ChefAccessDenied, SignInRequired } from "@/components/ChefAccessDenied";

export default async function MenuAnalyticsPage() {
  const session = await auth0.getSession();
  const user = session?.user;

  if (!user) {
    return <SignInRequired pageLabel="menu analytics dashboard" />;
  }

  const roles: string[] = user[ROLES_CLAIM] ?? [];
  const isChef = roles.includes(PIZZA_CHEF_ROLE);

  if (!isChef) {
    return <ChefAccessDenied pageLabel="Menu Analytics dashboard" />;
  }

  const menu = await getMenuFromS3();

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="mb-1 text-2xl font-bold text-gray-900">📊 Menu Analytics</h1>
      <p className="mb-6 text-sm text-gray-500">Lifetime orders per menu item, most ordered first.</p>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <MenuAnalyticsChart menu={menu} />
      </div>
    </main>
  );
}
