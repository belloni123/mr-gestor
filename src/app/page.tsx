import { MrGestorApp } from "@/components/mr-gestor-app";
import { requireSessionUser, getAllowedCompanySlugs } from "@/lib/auth";
import { getDashboardCompaniesForSlugs } from "@/lib/demo-dashboard-data";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await requireSessionUser();

  if (user.mustChangePassword) {
    redirect("/account/security?required=1");
  }

  const companies = getDashboardCompaniesForSlugs(getAllowedCompanySlugs(user));

  return <MrGestorApp companies={companies} user={user} />;
}
