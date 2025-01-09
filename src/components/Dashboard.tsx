"use client"; // Add this line to make this a Client Component

import { signOut } from "next-auth/react"; // Import signOut for logout functionality
import { Button } from "@/components/ui/button";
import { Session } from "next-auth";
import DialogCredentials from "./DialogCredentials";
import { toast } from "@/hooks/use-toast";
import Cookies from "js-cookie";

export default function Dashboard({ session }: { session: Session }) {
  const toastMessage = Cookies.get("toastMessage");
  if (toastMessage) {
    try {
      const { title, description } = JSON.parse(toastMessage);
      toast({ title, description });
      // Remove the cookie after showing the toast
      Cookies.remove("toastMessage");
    } catch (error) {
      console.error("Error parsing toast message:", error);
    }
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          {" "}
          Welcome back, {session.user?.name}!
        </h1>
        <p className="m-4 text-lg text-muted-foreground">
          You are successfully logged into your dashboard.
        </p>
        <DialogCredentials session={session} />
        <div className="py-4"></div>
        <Button onClick={() => signOut({ callbackUrl: "/" })}>
          Click here to logout
        </Button>
      </div>
    </div>
  );
}
