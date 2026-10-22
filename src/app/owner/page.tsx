export const dynamic = "force-dynamic";

import { db } from "@/db";
import { auth } from "@/auth";
import { bookings, vehicles, vehicleOwners, customerProfiles, users } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar, MapPin, User, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { redirect } from "next/navigation";
import { OwnerApprovalActions } from "./owner-approval-actions";
import Link from "next/link";

export default async function OwnerDashboard() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const ownerProfile = await db.query.vehicleOwners.findFirst({
    where: eq(vehicleOwners.userId, session.user.id),
  });

  if (!ownerProfile) {
    return (
      <div className="container mx-auto p-12 text-center">
        <h1 className="text-2xl font-bold">Owner profile not found.</h1>
        <p className="text-muted-foreground">Please register as an owner first.</p>
      </div>
    );
  }

  const myVehicles = await db.query.vehicles.findMany({
    where: eq(vehicles.ownerId, ownerProfile.id),
  });

  const vehicleIds = myVehicles.map(v => v.id);

  const ownerBookings = vehicleIds.length > 0 ? await db.query.bookings.findMany({
    where: eq(bookings.vehicleId, vehicleIds[0]),
    orderBy: [desc(bookings.createdAt)],
    with: {
      vehicle: true,
      customer: {
        with: {
          user: true
        }
      },
      driver: {
        with: {
          user: true
        }
      }
    }
  }) : [];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Owner Portal</h1>
          <p className="text-muted-foreground">Manage your fleet and bookings.</p>
        </div>
        <Link href="/owner/add-vehicle" className={buttonVariants({ className: "bg-secondary text-white font-bold" })}>
          + Add New Nganya
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <h2 className="text-2xl font-bold">Manage Bookings</h2>
        <div className="space-y-4">
          {ownerBookings.map((booking) => (
            <Card key={booking.id} className="border-border/50 bg-card/30">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold">{(booking as any).vehicle?.name ?? "Nganya"}</h3>
                      <Badge className={booking.status === "approved" ? "bg-green-500" : "bg-primary"}>
                        {booking.status.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center text-muted-foreground"><Calendar className="mr-2 h-4 w-4 text-primary" /> {format(new Date(booking.startDate), "PPP")}</div>
                      <div className="flex items-center text-muted-foreground"><User className="mr-2 h-4 w-4 text-primary" /> Customer: {(booking as any).customer?.user?.name ?? "Customer"}</div>
                      <div className="flex items-center text-muted-foreground"><MapPin className="mr-2 h-4 w-4 text-primary" /> {booking.pickupLocation}</div>
                      <div className="flex items-center text-muted-foreground"><CheckCircle className="mr-2 h-4 w-4 text-accent" /> Driver: {(booking as any).driver?.user?.name ?? "Unassigned"}</div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center space-y-2 md:w-48">
                    {booking.status === "awaiting_owner" ? (
                      <OwnerApprovalActions bookingId={booking.id} />
                    ) : (
                      <div className="text-center p-2 rounded bg-muted/50">
                        <span className="text-xs font-bold uppercase text-muted-foreground">{booking.status}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {ownerBookings.length === 0 && (
            <p className="text-muted-foreground">No bookings found for your vehicles.</p>
          )}
        </div>
      </div>
    </div>
  );
}
