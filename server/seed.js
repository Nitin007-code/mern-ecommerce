const sampleProducts = [
  {
    name: 'Wireless Headphones',
    description: 'Noise-cancelling over-ear headphones with 20hr battery life',
    price: 2999,
    image: 'https://picsum.photos/seed/headphones/300/300',
    category: 'Electronics',
    stock: 15,
  },
  {
    name: 'Digital Watch',
    description: 'Digital smart watch with 10hr battery life and water resistant property',
    price: 4999,
    image: 'https://picsum.photos/seed/watch/300/300',
    category: 'Electronics',
    stock: 20,
  },
  {
    name: 'Cotton T-Shirt',
    description: 'Comfortable 100% cotton t-shirt, available in multiple sizes',
    price: 599,
    image: 'https://picsum.photos/seed/tshirt/300/300',
    category: 'Clothing',
    stock: 50,
  },
  {
    name: 'Running Shoes',
    description: 'Lightweight running shoes with breathable mesh design',
    price: 3499,
    image: 'https://picsum.photos/seed/shoes/300/300',
    category: 'Footwear',
    stock: 30,
  },
];
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/product");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected");

    await Product.deleteMany({});
    await Product.insertMany(sampleProducts);

    console.log("Products Seeded Successfully!");

    process.exit();
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });