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

    // Stripe ke liye line_items ko clean karna
    const line_items = items.map((item: any) => {
      // Image Validation: Stripe sirf 'http' se shuru hone wale links leta hai
      const hasValidImage = item.image && typeof item.image === "string" && item.image.startsWith("http");
      
      return {
        price_data: {
          currency: "pkr",
          product_data: {
            name: item.name,
            // Agar image valid nahi hai toh array khali rakhein (ye error se bachayega)
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
      // localhost par test karne ke liye ye sahi hai
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/",
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Backend Error:", error);
    // Behtar error message bhej rahe hain
    return NextResponse.json({ error: error.raw?.message || error.message }, { status: 500 });
  }
}