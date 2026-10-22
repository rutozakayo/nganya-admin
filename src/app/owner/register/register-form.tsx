"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { registerOwnerAction, type OwnerRegisterState } from "./actions";

const initial: OwnerRegisterState = {};

export function OwnerRegisterForm() {
  const [state, action, pending] = useActionState(registerOwnerAction, initial);

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="businessName" className="text-sm font-medium">Fleet / business name</label>
        <Input id="businessName" name="businessName" placeholder="Nairobi Kings Fleet" required
          className="border-border/50 bg-background/50" />
      </div>
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">Your full name</label>
        <Input id="name" name="name" placeholder="John Mwangi" autoComplete="name" required
          className="border-border/50 bg-background/50" />
      </div>
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">Email</label>
        <Input id="email" name="email" type="email" placeholder="owner@example.com" autoComplete="email" required
          className="border-border/50 bg-background/50" />
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">Password</label>
        <Input id="password" name="password" type="password" placeholder="At least 8 characters"
          autoComplete="new-password" required className="border-border/50 bg-background/50" />
      </div>

      {state.error && (
        <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <p className="text-xs text-muted-foreground">
        New owner accounts are reviewed by an administrator before listings can be published.
      </p>

      <Button type="submit" disabled={pending} className="h-12 w-full bg-secondary font-bold text-white">
        {pending ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account…</>) : "Create owner account"}
      </Button>
    </form>
  );
}
