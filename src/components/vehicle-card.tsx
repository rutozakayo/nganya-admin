import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, MapPin, Star } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";

interface VehicleCardProps {
  vehicle: {
    id: string;
    name: string;
    registrationNumber: string;
    basePrice: string;
    capacity: number;
    operatingArea: string | null;
    images: { url: string; isMain: boolean }[];
    features: string | any;
  };
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const mainImage = vehicle.images.find((img) => img.isMain)?.url || vehicle.images[0]?.url || "";
  const features = typeof vehicle.features === "string" ? JSON.parse(vehicle.features) : vehicle.features || [];

  return (
    <Card className="group overflow-hidden border-border/50 bg-card/30 backdrop-blur-sm transition-all hover:border-primary/50">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={mainImage}
          alt={vehicle.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <Badge className="absolute right-4 top-4 bg-primary/80 text-primary-foreground backdrop-blur-md">
          KSh {parseFloat(vehicle.basePrice).toLocaleString()}/day
        </Badge>
      </div>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">{vehicle.name}</CardTitle>
          <div className="flex items-center text-xs text-muted-foreground">
            <Star className="mr-1 h-3 w-3 fill-accent text-accent" />
            4.9
          </div>
        </div>
        <p className="text-xs font-mono text-muted-foreground">{vehicle.registrationNumber}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {features.slice(0, 3).map((f: string) => (
            <Badge key={f} variant="outline" className="border-border/50 text-[10px]">
              {f}
            </Badge>
          ))}
          {features.length > 3 && (
            <Badge variant="outline" className="border-border/50 text-[10px]">
              +{features.length - 3} more
            </Badge>
          )}
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-muted-foreground">
            <Users className="mr-2 h-4 w-4" />
            {vehicle.capacity} passengers
          </div>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="mr-2 h-4 w-4" />
            {vehicle.operatingArea || "Nairobi"}
          </div>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Link href={`/nganya/${vehicle.id}`} className={buttonVariants({ variant: "outline", className: "flex-1 border-primary/20 hover:bg-primary/10" })}>
          Details
        </Link>
        <Link href={`/nganya/${vehicle.id}`} className={buttonVariants({ className: "flex-1 bg-primary text-primary-foreground hover:brightness-110" })}>
          Book Now
        </Link>
      </CardFooter>
    </Card>
  );
}

