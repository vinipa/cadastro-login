import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import Cookies from "js-cookie";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";

export default function DialogCredentials({ session }: { session: Session }) {
  const [name, setName] = useState(session.user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const email = session.user?.email;

  async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const response = await fetch("/api/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name,
          currentPassword,
        }),
      });

      if (!response.ok) {
        // Parse the error message from the response
        const data = await response.json();
        const errorMessage = data.error || "An unknown error occurred";

        // Show error toast
        toast({
          title: "An error occurred",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      if (!currentPassword) {
        toast({
          title: "Password required",
          description: "Passwords is required to change credentials",
          variant: "destructive",
        });
        return;
      }
      const data = await response.json();
      console.log(data);

      await signIn("credentials", {
        email,
        password: currentPassword,
        redirect: false,
      });

      // Save toast data in sessionStorage
      Cookies.set(
        "toastMessage",
        JSON.stringify({
          title: "Credentials changed successfully",
          description: "Your credentials were saved.",
        })
      );

      window.location.href = "/dashboard";
    } catch (err) {
      toast({
        title: "An unexpected error occurred",
        description: String(err),
        variant: "destructive",
      });
    }
  }
  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <Button> Update credentials</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter your new credentials</DialogTitle>
            <DialogDescription>
              Press save to confirm the changes
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input type="text" value={email || ""} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="name"
                placeholder={name || ""}
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Change credentials
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
