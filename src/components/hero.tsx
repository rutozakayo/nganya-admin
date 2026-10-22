import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Search, Calendar, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      {/* Background patterns or gradients */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,rgba(0,242,255,0.08)_0%,rgba(0,0,0,0)_100%)]" />
      <div className="absolute top-0 right-0 -z-10 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary/10 blur-3xl" />

      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary backdrop-blur-sm">
            <span className="mr-2 flex h-2 w-2 rounded-full bg-primary" />
            Nairobi's Most Iconic Fleet
          </div>
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
            HIRE YOUR <br />
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              DREAM NGANYA
            </span>
          </h1>
          <p className="mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Book premium customized matatus for weddings, parties, road trips, and music videos. Experience Kenyan urban culture at its best.
          </p>

          <div className="w-full max-w-4xl rounded-2xl border border-border bg-card/50 p-4 shadow-2xl backdrop-blur-xl md:p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-10 h-12 border-border/50 bg-background/50 focus:border-primary"
                  placeholder="Pickup Location"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  className="pl-10 h-12 border-border/50 bg-background/50 focus:border-primary"
                  placeholder="Select Date"
                />
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-10 h-12 border-border/50 bg-background/50 focus:border-primary"
                  placeholder="Event Type"
                />
              </div>
              <Button className="h-12 w-full bg-primary text-primary-foreground text-lg font-bold hover:brightness-110">
                Explore Nganyas
              </Button>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link href="/browse" className={buttonVariants({ size: "lg", className: "h-14 px-8 text-lg font-bold bg-primary hover:brightness-110" })}>
              Start Booking
            </Link>
            <Link href="/owner/register" className={buttonVariants({ size: "lg", variant: "outline", className: "h-14 px-8 text-lg font-bold border-secondary text-secondary hover:bg-secondary/10" })}>
              List Your Vehicle
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

