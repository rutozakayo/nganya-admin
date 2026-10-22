"use server";

import { db } from "@/db";
import { bookings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateBookingStatus(
  bookingId: string,
  status: "approved" | "rejected"
) {
  await db.update(bookings)
    .set({ 
      status,
      updatedAt: new Date()
    })
    .where(eq(bookings.id, bookingId));

  // Notify customer...

  revalidatePath("/owner");
  return { success: true };
}
