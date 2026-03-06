import mongoose from 'mongoose';

// 1. Product ka Schema (Structure) define kar rahe hain
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  description: String,
  image: String,
  stock: Number
});

// Agar Model pehle se bana hai to wo lo, warna naya banao
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const products = [
  {
    name: "Rolex Submariner Gold",
    price: 25000,
    category: "Watches",
    description: "Authentic 18k gold luxury watch.",
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa",
    stock: 5
  },
  {
    name: "iPhone 15 Pro Max",
    price: 1400,
    category: "Mobiles",
    description: "Latest Apple flagship with Titanium body.",
    image: "https://images.unsplash.com/photo-1696446701796-da61225697cc",
    stock: 20
  },
  {
    name: "Samsung S24 Ultra",
    price: 1300,
    category: "Mobiles",
    description: "Powerful AI features and 200MP camera.",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf",
    stock: 15
  },
  {
    name: "Sony PlayStation 5",
    price: 500,
    category: "Gaming",
    description: "Next-gen gaming console with 4K support.",
    image: "https://images.unsplash.com/photo-1606813907291-d86ebb9474ad",
    stock: 12
  },
  {
    name: "MacBook Pro M3",
    price: 2800,
    category: "Laptops",
    description: "Ultimate machine for creative professionals.",
    image: "https://images.unsplash.com/photo-1517336714460-4c50d1103f0d",
    stock: 8
  }
];

const seedDB = async () => {
  try {
    // APNA MONGODB KA LINK YAHAN DALEN
    const MONGODB_URI = "mongodb+srv://ahmaralimemon187_db_user:Ahmar786@cluster0.8bxe3gp.mongodb.net/myStore";
    
    console.log("Connecting to Database...");
    await mongoose.connect(MONGODB_URI);
    
    // Purana data clear karne ke liye (Optional):
    // await Product.deleteMany({}); 

    console.log("Inserting Products...");
    await Product.insertMany(products);
    
    console.log("✅ Mubarak ho! Saare products database mein chale gaye.");
    process.exit();
  } catch (error) {
    console.error("❌ Error aya hai:", error);
    process.exit(1);
  }
};

seedDB();