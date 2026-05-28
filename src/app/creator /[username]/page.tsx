"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { initializePayment, verifyPayment, generateReference, formatAmount } from "@/lib/payments";
import { createClient } from "@/lib/supabase/client";
import { ShoppingCart, Loader2, CheckCircle, XCircle } from "lucide-react";

interface PaymentButtonProps {
  productId: string;
  amount: number;
  title: string;
}

export function PaymentButton({ productId, amount, title }: PaymentButtonProps) {
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "failed">("idle");
  const [message, setMessage] = useState("");
  const supabase = createClient();

  const handlePurchase = async () => {
    setStatus("processing");
    setMessage("Initializing payment...");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setStatus("failed");
        setMessage("Please sign in to purchase");
        return;
      }

      const reference = generateReference();

      await supabase.from("purchases").insert({
        user_id: user.id,
        product_id: productId,
        amount,
        status: "pending",
        reference,
      });

      const result = await initializePayment({
        amount,
        email: user.email || "",
        reference,
        metadata: { product_id: productId, user_id: user.id },
        callback_url: `${window.location.origin}/payment/verify`,
      });

      if (!result.success) {
        setStatus("failed");
        setMessage(result.message);
        return;
      }

      if (result.authorization_url?.includes("reference=")) {
        setMessage("Processing mock payment...");
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        const verifyResult = await verifyPayment(reference);
        
        if (verifyResult.success) {
          await supabase.from("purchases").update({ status: "completed" }).eq("reference", reference);
          await supabase.rpc("increment_product_sales", { product_uuid: productId });
          
          setStatus("success");
          setMessage("Payment successful! You now have access.");
        } else {
          setStatus("failed");
          setMessage(verifyResult.message);
        }
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      setStatus("failed");
      setMessage(err.message || "Payment failed");
    }
  };

  if (status === "success") {
    return (
      <div className="text-center">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-2" />
        <p className="text-green-400 text-sm">{message}</p>
        <Button 
          variant="outline" 
          className="mt-4 border-green-500/30 text-green-400"
          onClick={() => setStatus("idle")}
        >
          Buy Another
        </Button>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="text-center">
        <XCircle className="mx-auto h-12 w-12 text-red-500 mb-2" />
        <p className="text-red-400 text-sm">{message}</p>
        <Button 
          className="mt-4 bg-whop-accent hover:bg-whop-accent/90 text-white"
          onClick={() => setStatus("idle")}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handlePurchase}
      disabled={status === "processing"}
      className="w-full bg-whop-accent hover:bg-whop-accent/90 text-white h-12 text-lg"
    >
      {status === "processing" ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          {message}
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-5 w-5" />
          Buy Now — {formatAmount(amount)}
        </>
      )}
    </Button>
  );
}
