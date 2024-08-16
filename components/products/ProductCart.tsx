import React, { useState } from 'react';
import { Product } from './Product';

interface ProductCartProps {
  items: Product[];
  onRemoveFromCart: (product: Product) => void;
  onCheckout:()=>void;
}

const ProductCart: React.FC<ProductCartProps> = ({ items, onRemoveFromCart,onCheckout }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // Number of items per page

  const calculateTotal = () => {
    return items.reduce((total, product) => total + product.price * product.quantity, 0).toFixed(2);
  };

  const totalPages = Math.ceil(items.length / itemsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Slice items for the current page
  const displayedItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Cart Items</h2>
      {items.length > 0 ? (
        <>
          <ul data-testid="cart-items-list" className="space-y-4">
            {displayedItems.map((item, index) => (
              <li key={index} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-gray-600">{item.description}</p>
                  <p className="text-gray-600">Quantity: {item.quantity}</p>
                  <p className="text-gray-600">Price: KES {item.price.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => onRemoveFromCart(item)}
                  className="ml-4 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                  aria-label="Delete Item"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-6 text-center font-semibold text-xl">
            <p data-testid="cart-total">Total: KES {calculateTotal()}</p>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
              aria-label="Previous Page"
            >
              Previous
            </button>
            <span className="text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
              aria-label="Next Page"
            >
              Next
            </button>
          </div>
          {/* Checkout Button */}
          <div className="mt-6 text-center">
            {items.length > 0 && (
              <button
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                aria-label="Checkout"
                onClick={onCheckout}
              >
                Checkout
              </button>
            )}
          </div>
        </>
      ) : (
        <p className="text-center text-gray-600">Your cart is empty.</p>
      )}
    </div>
  );
};

export default ProductCart;
