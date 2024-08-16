"use client";
import React, { useState } from 'react';
import ProductCart from '../products/ProductCart';
import { Product } from '../products/Product';
import ProductForm from '../products/ProductForm';
import { useRouter } from 'next/navigation';

const ProductPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<Product[]>([]);
const router = useRouter();
  const handleAddToCart = (newProduct: Product) => {
    setCartItems([...cartItems, newProduct]);
  };

  const handleRemoveFromCart = (productToRemove: Product) => {
    setCartItems(cartItems.filter(item => item !== productToRemove));
  };

  const handleCheckout=()=>{
    // Create the query string with URLSearchParams
  const query = new URLSearchParams({
    products: JSON.stringify(cartItems),
    serviceFee: '5',
    deliveryFee: '0',
  }).toString();

  // Push the route with the query string
  router.push(`/checkout?${query}`);
  }

  return (
    <div className="flex flex-col sm:flex-row max-w-screen-xl w-screen mx-auto p-8 gap-8">
      <div className="flex-1 bg-white shadow-lg rounded-lg p-4">
        <ProductForm onAddToCart={handleAddToCart} />
      </div>
      <div className="flex-1 bg-white shadow-lg rounded-lg p-4">
        <ProductCart items={cartItems} onRemoveFromCart={handleRemoveFromCart} onCheckout={handleCheckout} />
      </div>
    </div>
  );
};

export default ProductPage;
