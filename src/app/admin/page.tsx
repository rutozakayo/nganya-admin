export const dynamic = "force-dynamic";

import { db } from "@/db";
import { auth } from "@/auth";
import { users, driverProfiles, vehicles, bookings, vehicleOwners } from "@/db/schema";
import { count, eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Users, Car, ShieldCheck, CalendarRange } from "lucide-react";

async function AdminDashboardContent() {
  const session = await auth();
  if ((session?.user as any)?.role !== "admin") redirect("/");

  const [totalCustomers] = await db.select({ value: count() }).from(users).where(eq(users.role, "customer"));
  const [totalDrivers] = await db.select({ value: count() }).from(users).where(eq(users.role, "driver"));
  const [totalOwners] = await db.select({ value: count() }).from(users).where(eq(users.role, "owner"));
  const [totalVehicles] = await db.select({ value: count() }).from(vehicles);
  const [pendingBookings] = await db.select({ value: count() }).from(bookings).where(eq(bookings.status, "pending"));

  const stats = [
    { name: "Total Customers", value: totalCustomers.value, icon: Users, color: "text-blue-500" },
    { name: "Total Drivers", value: totalDrivers.value, icon: ShieldCheck, color: "text-green-500" },
    { name: "Total Owners", value: totalOwners.value, icon: ShieldCheck, color: "text-purple-500" },
    { name: "Total Nganyas", value: totalVehicles.value, icon: Car, color: "text-primary" },
    { name: "Pending Bookings", value: pendingBookings.value, icon: CalendarRange, color: "text-secondary" },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight">Admin Control Panel</h1>
        <p className="text-muted-foreground">Global overview of the NGANYA HIRE platform.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <Card key={stat.name} className="border-border/50 bg-card/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card className="border-border/50 bg-card/30">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
             <p className="text-sm text-muted-foreground italic">Activity log coming soon...</p>
          </CardContent>
        </Card>
        
        <Card className="border-border/50 bg-card/30">
          <CardHeader>
            <CardTitle>Pending Verifications</CardTitle>
          </CardHeader>
          <CardContent>
             <p className="text-sm text-muted-foreground italic">No pending verifications at the moment.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={<div className="container mx-auto min-h-[40vh] px-4 py-12" aria-hidden="true" />}>
      <AdminDashboardContent />
    </Suspense>
  );
}
