// Paystack Integration Placeholder
// TODO: Implement when credentials are available

import { PaymentIntent, PaymentResult, VerificationResult } from "./index";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = "https://api.paystack.co";

export async function paystackInitialize(intent: PaymentIntent): Promise<PaymentResult> {
  throw new Error("Paystack not configured. Use mock provider.");
}

export async function paystackVerify(reference: string): Promise<VerificationResult> {
  throw new Error("Paystack not configured. Use mock provider.");
}

export const PAYSTACK_WEBHOOK_EVENTS = {
  CHARGE_SUCCESS: "charge.success",
  SUBSCRIPTION_CREATE: "subscription.create",
  SUBSCRIPTION_DISABLE: "subscription.disable",
  INVOICE_CREATE: "invoice.create",
  INVOICE_UPDATE: "invoice.update",
} as const;

export interface PaystackPlan {
  name: string;
  amount: number;
  interval: "daily" | "weekly" | "monthly" | "annually";
  plan_code: string;
}
