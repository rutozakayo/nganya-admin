import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function PostLoginPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = (session.user as { role?: string }).role;
  if (role === "admin") redirect("/admin");
  if (role === "owner") redirect("/owner");

  // Customers and drivers belong on their own portals.
  redirect("/login?error=wrong-portal");
}
