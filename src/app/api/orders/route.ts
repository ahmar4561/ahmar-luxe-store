import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

// 1. Naya Order Save karne ke liye
export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectDB();
    const newOrder = await Order.create({
      customerName: body.customerName,
      phone: body.phone,
      address: body.address,
      itemsCount: body.itemsCount,
    });
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Order failed" }, { status: 500 });
  }
}

// 2. Saare Orders dekhne ke liye
export async function GET() {
  await connectDB();
  const orders = await Order.find({}).sort({ createdAt: -1 });
  return NextResponse.json(orders);
}

// 3. Order ko "Delivered" mark karne ke liye (YE NAYA HAI)
export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();
    await connectDB();
    const updatedOrder = await Order.findByIdAndUpdate(
      id, 
      { status: status }, 
      { new: true }
    );
    return NextResponse.json(updatedOrder);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}