"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { initializePayment, verifyPayment, generateReference, formatAmount } from "@/lib/payments";
import { Users, Loader2, CheckCircle, Crown } from "lucide-react";

interface JoinCommunityButtonProps {
  communityId: string;
  isPaid: boolean;
  price: number;
}

export function JoinCommunityButton({ communityId, isPaid, price }: JoinCommunityButtonProps) {
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "failed">("idle");
  const [message, setMessage] = useState("");
  const supabase = createClient();

  const handleJoin = async () => {
    setStatus("processing");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setStatus("failed");
        setMessage("Please sign in to join");
        return;
      }

      if (!isPaid || price === 0) {
        const { error } = await supabase.from("memberships").insert({
          user_id: user.id,
          community_id: communityId,
          status: "active",
        });

        if (error) throw error;
        
        await supabase.rpc("increment_community_members", { community_uuid: communityId });
        
        setStatus("success");
        setMessage("You've joined the community!");
        return;
      }

      const reference = generateReference();
      
      const result = await initializePayment({
        amount: price,
        email: user.email || "",
        reference,
        metadata: { community_id: communityId, user_id: user.id, type: "membership" },
      });

      if (!result.success) {
        setStatus("failed");
        setMessage(result.message);
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 1500));
      const verifyResult = await verifyPayment(reference);

      if (verifyResult.success) {
        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + 1);

        await supabase.from("memberships").insert({
          user_id: user.id,
          community_id: communityId,
          status: "active",
          expires_at: expiresAt.toISOString(),
        });

        await supabase.rpc("increment_community_members", { community_uuid: communityId });

        setStatus("success");
        setMessage("Membership activated!");
      } else {
        setStatus("failed");
        setMessage(verifyResult.message);
      }
    } catch (err: any) {
      console.error("Join error:", err);
      setStatus("failed");
      setMessage(err.message || "Failed to join");
    }
  };

  if (status === "success") {
    return (
      <div className="flex items-center gap-2 text-green-400">
        <CheckCircle className="h-5 w-5" />
        <span className="text-sm">{message}</span>
      </div>
    );
  }

  return (
    <Button
      onClick={handleJoin}
      disabled={status === "processing"}
      className={`${isPaid ? "bg-whop-accent hover:bg-whop-accent/90" : "bg-green-600 hover:bg-green-700"} text-white`}
    >
      {status === "processing" ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : isPaid ? (
        <Crown className="mr-2 h-4 w-4" />
      ) : (
        <Users className="mr-2 h-4 w-4" />
      )}
      {status === "processing" 
        ? "Processing..." 
        : isPaid 
          ? `Join — ${formatAmount(price)}/mo` 
          : "Join Free"
      }
    </Button>
  );
}
