// components/ProductForm.tsx
import React, { useState } from 'react';
import { Product } from './Product';

// Define the type for the product data
interface ProductFormProps {
  onAddToCart: (product: Product) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ onAddToCart }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [quantity, setQuantity] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);

  const [errors, setErrors] = useState<string[]>([]);

  const validateForm = () => {
    const newErrors: string[] = [];

    if (!name) newErrors.push('Product Name is required.');
    if (!description) newErrors.push('Product Description is required.');
    if (!image) newErrors.push('Product Image URL is required.');
    if (quantity <= 0) newErrors.push('Product Quantity must be greater than zero.');
    if (price <= 0) newErrors.push('Product Price must be greater than zero.');

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onAddToCart({ name, description, image, quantity: Number(quantity), price: Number(price) });
      setName('');
      setDescription('');
      setImage('');
      setQuantity(0);
      setPrice(0);
      setErrors([]);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Add New Product</h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter product name"
            className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-4 py-2"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Product Description</label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter product description"
            className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-4 py-2"
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Product Image URL</label>
          <input
            id="image"
            name="image"
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Enter image URL"
            className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-4 py-2"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Product Quantity</label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              placeholder="Enter quantity"
              className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-4 py-2"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Product Price</label>
            <input
              id="price"
              name="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              placeholder="Enter price"
              className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-4 py-2"
            />
          </div>
        </div>

        {errors.length > 0 && (
          <div className="bg-red-100 text-red-600 border border-red-400 rounded-lg p-4 mb-4">
            <ul className="list-disc pl-5">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Add Item to Cart
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
