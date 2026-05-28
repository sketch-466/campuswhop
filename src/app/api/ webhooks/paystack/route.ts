import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const signature = request.headers.get("x-paystack-signature");

    // TODO: Verify signature when Paystack is integrated
    // const hash = crypto
    //   .createHmac("sha512", process.env.PAYSTACK_WEBHOOK_SECRET!)
    //   .update(JSON.stringify(payload))
    //   .digest("hex");
    // if (hash !== signature) {
    //   return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    // }

    switch (payload.event) {
      case "charge.success":
        console.log("Webhook: charge.success", payload.data);
        break;
      case "subscription.create":
        console.log("Webhook: subscription.create");
        break;
      case "subscription.disable":
        console.log("Webhook: subscription.disable");
        break;
      default:
        console.log(`Unhandled webhook event: ${payload.event}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 400 });
  }
}
