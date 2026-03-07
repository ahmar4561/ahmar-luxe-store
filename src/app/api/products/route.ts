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
// 4. PATCH: Saari purani images ko online links se replace karne ke liye
export async function PATCH() {
  try {
    await connectDB();
    
    // 1. Saare Mobiles ki images update karein
    await Product.updateMany(
      { category: "Mobile" }, 
      { image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1000" }
    );

    // 2. Saari Watches ki images update karein
    await Product.updateMany(
      { category: "Watches" }, 
      { image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000" }
    );

    // 3. Saare Laptops ki images update karein
    await Product.updateMany(
      { category: "Laptop" }, 
      { image: "https://images.unsplash.com/photo-1517336714460-4c9889a79683?q=80&w=1000" }
    );

    return NextResponse.json({ message: "Success! Sari images online links se replace ho gayi hain. Ab website check karein." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}