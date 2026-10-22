"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, X, Loader2 } from "lucide-react";
import { updateBookingStatus } from "./actions";

export function OwnerApprovalActions({ bookingId }: { bookingId: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (status: "approved" | "rejected") => {
    setIsLoading(true);
    try {
      await updateBookingStatus(bookingId, status);
      alert(`Booking ${status}!`);
      window.location.reload();
    } catch (error) {
      alert("Failed to update booking status.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <Button 
        className="bg-accent hover:brightness-110 text-accent-foreground font-bold" 
        onClick={() => handleAction("approved")}
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
        Approve Booking
      </Button>
      <Button 
        variant="outline" 
        className="border-red-500 text-red-500 hover:bg-red-500/10 font-bold"
        onClick={() => handleAction("rejected")}
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <X className="mr-2 h-4 w-4" />}
        Reject Request
      </Button>
    </div>
  );
}
