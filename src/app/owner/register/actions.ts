"use server";

import { db } from "@/db";
import { users, vehicleOwners } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

const schema = z.object({
  businessName: z.string().trim().min(2, "Enter your business or fleet name."),
  name: z.string().trim().min(2, "Enter your full name."),
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Use at least 8 characters."),
});

export type OwnerRegisterState = { error?: string };

export async function registerOwnerAction(
  _prev: OwnerRegisterState,
  formData: FormData
): Promise<OwnerRegisterState> {
  const parsed = schema.safeParse({
    businessName: formData.get("businessName"),
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your details and try again." };
  }

  const { businessName, name, email, password } = parsed.data;

  const existing = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (existing) return { error: "An account with this email already exists. Try signing in." };

  const hashed = await bcrypt.hash(password, 10);

  try {
    const [user] = await db
      .insert(users)
      .values({ name, email, password: hashed, role: "owner" })
      .returning();
    await db.insert(vehicleOwners).values({ userId: user.id, businessName, isVerified: false });
  } catch (error) {
    console.error("owner register failed", error);
    return { error: "We could not create your owner account. Please try again." };
  }

  try {
    await signIn("credentials", { email, password, redirectTo: "/post-login" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Account created, but sign-in failed. Please log in manually." };
    }
    throw error;
  }

  return {};
}
