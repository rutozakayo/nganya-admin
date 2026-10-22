import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { OwnerRegisterForm } from "./register-form";

export const metadata = { title: "List Your Nganya | NGANYA HIRE" };

export default function OwnerRegisterPage() {
  return (
    <div className="container mx-auto grid max-w-5xl gap-10 px-4 py-16 md:grid-cols-2 md:items-center">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight">Turn your nganya into revenue</h1>
        <p className="mt-4 text-muted-foreground">
          List your customised matatu, set your own price, and approve every hire request yourself.
          You stay in control of which dates your vehicle works.
        </p>
        <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
          <li>• Driver availability is confirmed before you ever see a request.</li>
          <li>• You approve or reject each booking.</li>
          <li>• Your driver and vehicle documents are verified by our team.</li>
        </ul>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create an owner account</CardTitle>
          <CardDescription>Get set up in under a minute.</CardDescription>
        </CardHeader>
        <CardContent>
          <OwnerRegisterForm />
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already registered?{" "}
            <Link href="/login" className="font-bold text-primary hover:underline">Log in</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
