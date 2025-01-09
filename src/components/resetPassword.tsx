"use client";

import { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
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

      const data = await response.json();
      console.log(data);

      // Save toast data in sessionStorage
      sessionStorage.setItem(
        "toastMessage",
        JSON.stringify({
          title: "Password changed successfully",
          description: "You can now log in with your new credentials.",
        })
      );
      window.location.href = "/";
    } catch (err) {
      toast({
        title: "An unexpected error occurred",
        description: String(err),
        variant: "destructive",
      });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter">
            Change your password
          </h1>
          <p className="text-accent-foreground">
            Enter your details to create a new password
          </p>
        </div>
        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="name"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">New password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm new password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">
            Change password
          </Button>
        </form>
      </div>
    </div>
  );
}
