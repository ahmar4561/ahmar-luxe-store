import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectDB();
    const newOrder = await Order.create(body);
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Order failed" }, { status: 500 });
  }
}

export async function GET() {
  await connectDB();
  const orders = await Order.find({}).sort({ createdAt: -1 });
  return NextResponse.json(orders);
}