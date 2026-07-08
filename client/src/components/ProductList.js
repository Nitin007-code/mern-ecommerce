import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <p style={{ textAlign: 'center' }}>Loading products...</p>;

  return (
    <div className="product-grid">
      {products.map((product) => (
        <Link key={product._id} to={`/product/${product._id}`} className="product-card">
          <img src={product.image} alt={product.name} />
          <div className="product-card-body">
            <h3>{product.name}</h3>
            <span className="price-tag">₹{product.price}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default ProductList;