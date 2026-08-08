const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const Product = require('../models/product');
require('dotenv').config();

let mongoServer;

// Runs once before all tests in this file — spins up a fresh in-memory database
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

// Runs once after all tests finish — cleans up the in-memory database
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Runs before EACH test — ensures a clean slate, no leftover data between tests
beforeEach(async () => {
  await Product.deleteMany();
});

describe('GET /api/products', () => {
  it('returns an empty array when no products exist', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(res.body.products).toEqual([]);
  });

  it('returns products that exist in the database', async () => {
    await Product.create({
      name: 'Test Product',
      description: 'A product for testing',
      price: 999,
      image: 'https://example.com/img.jpg',
      category: 'Test',
      stock: 5,
    });

    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(res.body.products.length).toBe(1);
    expect(res.body.products[0].name).toBe('Test Product');
  });
});

describe('POST /api/products', () => {
  it('rejects creating a product without authentication', async () => {
    const res = await request(app).post('/api/products').send({
      name: 'Unauthorized Product',
      description: 'Should fail',
      price: 100,
      image: 'https://example.com/img.jpg',
      category: 'Test',
      stock: 1,
    });
    expect(res.statusCode).toBe(401); // no token = unauthorized
  });
});