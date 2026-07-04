import { redirect } from "next/navigation";

import { MfaSetupForm } from "@/components/auth/mfa-setup-form";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function MfaSetupPage() {
  const session = await getSession();

  if (session.user) {
    redirect("/");
  }

  if (!session.pendingMfa || session.pendingMfa.purpose !== "setup") {
    redirect("/login");
  }

  return (
    <main className="auth-page">
      <MfaSetupForm />
    </main>
  );
}
