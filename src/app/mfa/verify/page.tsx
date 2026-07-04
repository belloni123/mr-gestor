import { redirect } from "next/navigation";

import { MfaVerifyForm } from "@/components/auth/mfa-verify-form";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function MfaVerifyPage() {
  const session = await getSession();

  if (session.user) {
    redirect("/");
  }

  if (!session.pendingMfa || session.pendingMfa.purpose !== "verify") {
    redirect("/login");
  }

  return (
    <main className="auth-page">
      <MfaVerifyForm />
    </main>
  );
}
