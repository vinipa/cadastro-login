"use client";

import { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import Cookies from "js-cookie";
import SignUpForm from "./SignUpForm"; // Import SignUpForm

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false); // New state to toggle forms

  // Retrieve the toast data
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

  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const signInData = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (signInData?.error) {
        toast({
          title: "Login failed",
          description: signInData.error,
          variant: "destructive",
        });
      } else {
        // Save toast data in sessionStorage
        Cookies.set(
          "toastMessage",
          JSON.stringify({
            title: "Login successful",
            description: "You can now use your dashboard!",
          })
        );
        window.location.href = "/dashboard";
      }
    } catch (err) {
      toast({
        title: "An error occurred",
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
            {isSignUp ? "Create an Account" : "Welcome back"}
          </h1>
          <p className="text-accent-foreground">
            {isSignUp
              ? "Enter your details to create a new account"
              : "Enter your credentials to access your account"}
          </p>
        </div>

        {isSignUp ? (
          <SignUpForm setIsSignUp={setIsSignUp} />
        ) : (
          <form onSubmit={login} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember"></Checkbox>
                <Label htmlFor="remember">Remember me</Label>
              </div>
              <a
                href="/resetPassword"
                className="text-accent-foreground text-sm"
              >
                Forgot password?
              </a>
            </div>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>
        )}

        <div className="text-center text-sm">
          <a
            href="#"
            className="text-accent-foreground bold"
            onClick={() => setIsSignUp(!isSignUp)} // Toggle form
          >
            {isSignUp
              ? "Already have an account? Sign in"
              : "Don't have an account? Sign up"}
          </a>
        </div>
      </div>
    </div>
  );
}
