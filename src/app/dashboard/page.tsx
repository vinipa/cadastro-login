// app/dashboard/page.js (or .ts for TypeScript)
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Dashboard from "@/components/Dashboard";
import { authOptions } from "../api/auth/[...nextauth]/auth";

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
