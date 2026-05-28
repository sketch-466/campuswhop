
// Payment Service Abstraction

import { mockInitializePayment, mockVerifyPayment } from "./mock";

export type PaymentProvider = "mock" | "paystack";

const CURRENT_PROVIDER: PaymentProvider = 
  process.env.NEXT_PUBLIC_PAYMENT_PROVIDER === "paystack" ? "paystack" : "mock";

export interface PaymentIntent {
  amount: number;
  email: string;
  reference: string;
  metadata?: Record<string, any>;
  callback_url?: string;
}

export interface PaymentResult {
  success: boolean;
  reference?: string;
  authorization_url?: string;
  message: string;
  status?: "success" | "pending" | "failed";
}

export interface VerificationResult {
  success: boolean;
  amount?: number;
  status?: string;
  paid_at?: string;
  channel?: string;
  message: string;
}

export async function initializePayment(intent: PaymentIntent): Promise<PaymentResult> {
  return mockInitializePayment(intent);
}

export async function verifyPayment(reference: string): Promise<VerificationResult> {
  return mockVerifyPayment(reference);
}

export function generateReference(): string {
  return `campuswhop_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function formatAmount(amount: number): string {
  return `₦${(amount / 100).toLocaleString("en-NG")}`;
}

export function toKobo(amount: number): number {
  return amount * 100;
}
