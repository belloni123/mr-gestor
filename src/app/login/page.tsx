import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
import { isSessionUserFresh } from "@/lib/auth";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const session = await getSession();

  if (session.user && (await isSessionUserFresh(session.user))) {
    redirect("/");
  }

  return (
    <main className="auth-page">
      <LoginForm />
    </main>
  );
}
