import Hero from "@/components/Hero";
import MenuSection from "@/components/MenuSection";
import { auth0 } from "@/lib/auth0";

export default async function Home() {
  const session = await auth0.getSession();
  const user = session?.user;
  const isEmailVerified = user?.email_verified === true;

  return (
    <main>
      {user && !isEmailVerified && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 text-center text-sm text-amber-800 font-medium">
          ⚠️ Your email address is unverified. Please check your inbox to unlock checkout privileges.
        </div>
      )}
      <Hero />
      <MenuSection />
    </main>
  );
}
