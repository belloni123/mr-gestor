import { MrGestorApp } from "@/components/mr-gestor-app";
import { getProtectedPageContext } from "@/lib/protected-page";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { user, companies } = await getProtectedPageContext();

  return <MrGestorApp companies={companies} user={user} />;
}
