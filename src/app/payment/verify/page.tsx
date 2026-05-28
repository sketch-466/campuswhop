"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { verifyPayment } from "@/lib/payments";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

export default function PaymentVerifyPage() {
  const [status, setStatus] = useState<<"verifying" | "success" | "failed">("verifying");
  const [message, setMessage] = useState("Verifying your payment...");
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference") || searchParams.get("trxref");

  useEffect(() => {
    if (reference) {
      verifyTransaction();
    }
  }, [reference]);

  const verifyTransaction = async () => {
    try {
      const result = await verifyPayment(reference!);
      
      if (result.success) {
        setStatus("success");
        setMessage("Payment verified successfully!");
      } else {
        setStatus("failed");
        setMessage(result.message || "Payment verification failed");
      }
    } catch (err) {
      setStatus("failed");
      setMessage("An error occurred during verification");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <Card className="w-full max-w-md border-whop-border bg-whop-card">
        <CardContent className="p-8 text-center">
          {status === "verifying" && (
            <>
              <Loader2 className="mx-auto h-16 w-16 animate-spin text-whop-accent mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Verifying Payment</h2>
              <p className="text-gray-400">{message}</p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Payment Successful!</h2>
              <p className="text-gray-400 mb-6">{message}</p>
              <div className="space-y-3">
                <Link href="/dashboard">
                  <Button className="w-full bg-whop-accent hover:bg-whop-accent/90 text-white">
                    Go to Dashboard
                  </Button>
                </Link>
                <Link href="/explore">
                  <Button variant="outline" className="w-full border-whop-border text-gray-400">
                    Continue Exploring
                  </Button>
                </Link>
              </div>
            </>
          )}

          {status === "failed" && (
            <>
              <XCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Payment Failed</h2>
              <p className="text-gray-400 mb-6">{message}</p>
              <div className="space-y-3">
                <Button 
                  className="w-full bg-whop-accent hover:bg-whop-accent/90 text-white"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </Button>
                <Link href="/explore">
                  <Button variant="outline" className="w-full border-whop-border text-gray-400">
                    Back to Explore
                  </Button>
                </Link>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
