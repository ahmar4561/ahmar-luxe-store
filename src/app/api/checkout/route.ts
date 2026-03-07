import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16" as any,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const line_items = items.map((item: any) => {
      const hasValidImage = item.image && typeof item.image === "string" && item.image.startsWith("http");
      
      return {
        price_data: {
          currency: "pkr",
          product_data: {
            name: item.name,
            images: hasValidImage ? [item.image] : [],
          },
          unit_amount: Math.round(Number(item.price) * 100),
        },
        quantity: item.quantity || 1,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: line_items,
      mode: "payment",
      // LIVE URLS UPDATED HERE:
      success_url: "https://ahmar-luxe-store-e77d.vercel.app/success",
      cancel_url: "https://ahmar-luxe-store-e77d.vercel.app/",
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Backend Error:", error);
    return NextResponse.json({ error: error.raw?.message || error.message }, { status: 500 });
  }
}