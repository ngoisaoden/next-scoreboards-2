"use client";

import { useState, useTransition } from "react";
import { login, signUp } from "@/actions/auth.actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function submit(formData: FormData, mode: "login" | "signup") {
    setError(null);
    setMessage(null);

    startTransition(async () => {
      const result =
        mode === "login"
          ? await login({ success: false }, formData)
          : await signUp({ success: false }, formData);

      if (!result.success) {
        setError(result.error ?? "Authentication failed.");
        return;
      }

      setMessage("Account created. Check your email if confirmation is enabled.");
    });
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Log in</CardTitle>
        <CardDescription>Use your Supabase email and password account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            submit(new FormData(event.currentTarget), "login");
          }}
        >
          {error ? (
            <Alert className="border-destructive/50">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
          {message ? (
            <Alert>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          ) : null}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" autoComplete="email" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" autoComplete="current-password" required minLength={6} />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Working" : "Log in"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
