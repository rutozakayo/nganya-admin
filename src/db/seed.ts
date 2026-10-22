import { db } from "@/db";
import { users, vehicleOwners, vehicles, vehicleImages, driverProfiles } from "@/db/schema";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Seeding database...");

  // Create Admin
  const adminPassword = await bcrypt.hash("admin123", 10);
  const [admin] = await db.insert(users).values({
    email: "admin@nganyahire.com",
    name: "Platform Admin",
    password: adminPassword,
    role: "admin",
  }).returning();

  // Create Owner
  const ownerPassword = await bcrypt.hash("owner123", 10);
  const [ownerUser] = await db.insert(users).values({
    email: "owner@nganyahire.com",
    name: "John Matatu",
    password: ownerPassword,
    role: "owner",
  }).returning();

  const [ownerProfile] = await db.insert(vehicleOwners).values({
    userId: ownerUser.id,
    businessName: "Nairobi Kings Fleet",
    isVerified: true,
  }).returning();

  // Create Driver
  const driverPassword = await bcrypt.hash("driver123", 10);
  const [driverUser] = await db.insert(users).values({
    email: "driver@nganyahire.com",
    name: "Speedy Mike",
    password: driverPassword,
    role: "driver",
  }).returning();

  const [driverProfile] = await db.insert(driverProfiles).values({
    userId: driverUser.id,
    licenseNumber: "DL-12345678",
    verificationStatus: "verified",
    experienceYears: 10,
    bio: "Experienced PSV driver with a passion for custom matatus.",
  }).returning();

  // Create Vehicles
  const vehicleData = [
    {
      name: "MATATA KING",
      reg: "KDL 123X",
      price: "15000",
      capacity: 14,
      area: "CBD",
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "CHAMPION",
      reg: "KDM 456Y",
      price: "20000",
      capacity: 29,
      area: "Westlands",
      image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "PHANTOM",
      reg: "KDN 789Z",
      price: "12000",
      capacity: 14,
      area: "Rongai",
      image: "https://images.unsplash.com/photo-1632276536839-84cad7fd03b0?auto=format&fit=crop&q=80&w=800",
    },
  ];

  for (const v of vehicleData) {
    const [vehicle] = await db.insert(vehicles).values({
      ownerId: ownerProfile.id,
      name: v.name,
      registrationNumber: v.reg,
      basePrice: v.price,
      capacity: v.capacity,
      operatingArea: v.area,
      features: JSON.stringify(["VIP Sound", "LED Screens"]),
      status: "active",
    }).returning();

    await db.insert(vehicleImages).values({
      vehicleId: vehicle.id,
      url: v.image,
      isMain: true,
    });
  }

  console.log("Seeding completed!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
