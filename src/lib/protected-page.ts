import "server-only";

import { redirect } from "next/navigation";

import { getAllowedCompanySlugs, isSessionUserFresh, requireSessionUser } from "@/lib/auth";
import { getDashboardCompaniesForSlugs } from "@/lib/demo-dashboard-data";

export async function getProtectedPageContext() {
  const user = await requireSessionUser();

  if (!(await isSessionUserFresh(user))) {
    redirect("/login");
  }

  if (user.mustChangePassword) {
    redirect("/account/security?required=1");
  }

  return {
    user,
    companies: getDashboardCompaniesForSlugs(getAllowedCompanySlugs(user)),
  };
}
