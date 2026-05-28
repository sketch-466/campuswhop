// Mock Payment Service
// Simulates Paystack behavior for development and testing

import { PaymentIntent, PaymentResult, VerificationResult } from "./index";

const mockTransactions = new Map<string, {
  status: "pending" | "success" | "failed";
  amount: number;
  email: string;
  created_at: string;
}>();

export async function mockInitializePayment(intent: PaymentIntent): Promise<PaymentResult> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  mockTransactions.set(intent.reference, {
    status: "pending",
    amount: intent.amount,
    email: intent.email,
    created_at: new Date().toISOString(),
  });

  const callbackUrl = intent.callback_url || `${process.env.NEXT_PUBLIC_APP_URL}/payment/verify`;
  
  return {
    success: true,
    reference: intent.reference,
    authorization_url: `${callbackUrl}?reference=${intent.reference}&trxref=${intent.reference}`,
    message: "Mock payment initialized. Click to simulate payment.",
    status: "pending",
  };
}

export async function mockVerifyPayment(reference: string): Promise<VerificationResult> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const transaction = mockTransactions.get(reference);

  if (!transaction) {
    return {
      success: false,
      message: "Transaction not found",
    };
  }

  transaction.status = "success";
  mockTransactions.set(reference, transaction);

  return {
    success: true,
    amount: transaction.amount,
    status: "success",
    paid_at: new Date().toISOString(),
    channel: "mock_card",
    message: "Mock payment verified successfully",
  };
}

export async function mockFailPayment(reference: string): Promise<VerificationResult> {
  const transaction = mockTransactions.get(reference);
  
  if (transaction) {
    transaction.status = "failed";
    mockTransactions.set(reference, transaction);
  }

  return {
    success: false,
    amount: transaction?.amount,
    status: "failed",
    message: "Mock payment failed (simulated for testing)",
  };
}

export function getMockTransactionStatus(reference: string): string | null {
  return mockTransactions.get(reference)?.status || null;
}

export function getAllMockTransactions() {
  return Array.from(mockTransactions.entries()).map(([ref, data]) => ({
    reference: ref,
    ...data,
  }));
}
