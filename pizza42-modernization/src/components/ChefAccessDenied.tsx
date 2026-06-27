import { PIZZA_CHEF_ROLE } from "@/lib/claims";

export function SignInRequired({ pageLabel }: { pageLabel: string }) {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="mb-2 text-xl font-bold text-gray-900">Sign in required</h1>
      <p className="text-sm text-gray-500">Sign in with a Pizza Chef account to view the {pageLabel}.</p>
    </main>
  );
}

export function ChefAccessDenied({ pageLabel }: { pageLabel: string }) {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-2xl">
        🔒
      </div>
      <h1 className="mb-2 text-xl font-bold text-gray-900">Access denied</h1>
      <p className="text-sm text-gray-500">
        The {pageLabel} is only available to staff with the &ldquo;{PIZZA_CHEF_ROLE}&rdquo; role.
      </p>
    </main>
  );
}
