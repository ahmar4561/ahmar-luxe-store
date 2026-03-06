export const dynamic = 'force-dynamic'; // Ye line zaroori hai
export const revalidate = 0;
import { NextResponse } from "next/server";
import connectDB from "../../../lib/db"; 
import Product from "../../../models/Product"; 



// 1. GET: Saare products dikhane ke liye
export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. DELETE: Product khatam karne ke liye
export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { id } = await request.json(); // Client se ID receive karna

    if (!id) {
      return NextResponse.json({ error: "ID missing hai" }, { status: 400 });
    }

    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Product nahi mila" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product delete ho gaya!" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 3. POST: Naya product add karne ke liye (Humaara agla step)
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const newProduct = await Product.create(body);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}