// app/dashboard/page.js (or .ts for TypeScript)
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Dashboard from "@/components/Dashboard";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/"); // Redirect if no session
  }

  // Pass session to Client Component
  return (
    <div className="min-h-screen">
      <Dashboard session={session} />
    </div>
  );
}
