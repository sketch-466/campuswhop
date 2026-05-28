import { Suspense } from "react";
import PaymentVerifyClient from "./PaymentVerifyClient";

export const dynamic = 'force-dynamic';

export default function PaymentVerifyPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-whop-accent border-t-transparent mb-4"></div>
          <h2 className="text-xl font-bold text-white mb-2">Loading...</h2>
          <p className="text-gray-400">Please wait</p>
        </div>
      </div>
    }>
      <PaymentVerifyClient />
    </Suspense>
  );
}
