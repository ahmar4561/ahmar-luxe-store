export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { NextResponse } from "next/server";
import connectDB from "../../../lib/db"; 
import Product from "../../../models/Product"; 

export async function GET() {
  try {
    await connectDB();

    // 1. Database se saare products uthaye
    const productsFromDB = await Product.find({}).sort({ createdAt: -1 });

    // 2. Map function ke zariye har product ki image check karein
    // Agar image "/images" se shuru ho rahi hai, toh use foran online link se badal do
    const fixedProducts = productsFromDB.map((product: any) => {
      const p = product.toObject();
      
      if (p.image && p.image.startsWith('/images')) {
        if (p.category === 'Mobile') {
          p.image = "https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1000";
        } else if (p.category === 'Watches') {
          p.image = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000";
        } else {
          // Baki sab ke liye laptop ya generic pic
          p.image = "https://images.unsplash.com/photo-1517336714460-4c9889a79683?q=80&w=1000";
        }
      }
      return p;
    });

    return NextResponse.json(fixedProducts);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "ID missing hai" }, { status: 400 });
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: "Product nahi mila" }, { status: 404 });
    return NextResponse.json({ message: "Product delete ho gaya!" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

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