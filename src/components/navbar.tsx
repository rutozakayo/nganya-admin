import Link from "next/link";
import { connection } from "next/server";
import { Button, buttonVariants } from "@/components/ui/button";
import { auth, signOut } from "@/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, LayoutDashboard, Car, Shield } from "lucide-react";

export async function Navbar() {
  await connection();
  const session = await auth();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold tracking-tighter text-primary">
            NGANYA<span className="text-secondary">HIRE</span>
          </span>
        </Link>

        <div className="hidden items-center space-x-6 md:flex">
          <Link href="/admin" className="text-sm font-medium hover:text-primary">Admin</Link>
          <Link href="/owner" className="text-sm font-medium hover:text-primary">Owner Portal</Link>
        </div>

        <div className="flex items-center space-x-4">
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", size: "icon" }) + " relative rounded-full"}>
                <Avatar className="h-10 w-10 border border-primary">
                  <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                  <AvatarFallback>{session.user?.name?.[0] || "U"}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuItem className="flex flex-col items-start">
                  <p className="text-sm font-medium">{session.user?.name}</p>
                  <p className="text-xs text-muted-foreground">{session.user?.email}</p>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/dashboard" className="flex items-center">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                {(session.user as any).role === "owner" && (
                  <DropdownMenuItem>
                    <Link href="/owner" className="flex items-center">
                      <Car className="mr-2 h-4 w-4" />
                      <span>Owner Portal</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>
                  <form
                    action={async () => {
                      "use server";
                      await signOut();
                    }}
                    className="w-full"
                  >
                    <button className="flex w-full items-center">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/login" className={buttonVariants({ variant: "ghost" })}>Login</Link>
              <Link href="/register" className={buttonVariants({ className: "bg-primary text-primary-foreground hover:brightness-110" })}>Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

