import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Confetti from 'react-confetti';

type Product = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

type CheckoutPageProps = {
  products: Product[];
  serviceFee: number;
  deliveryFee: number;
};

const CheckoutPage: React.FC<CheckoutPageProps> = ({ products, serviceFee, deliveryFee }) => {
  const [productList, setProductList] = useState(products);
  const [currentDeliveryFee, setCurrentDeliveryFee] = useState(deliveryFee);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentLink, setPaymentLink] = useState<string | null>(null);
  const [referenceCode, setReferenceCode] = useState<string | null>(null);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false); // Added state
  const router = useRouter();

  useEffect(() => {
    if (paymentConfirmed) {
      setTimeout(() => {
        router.push('/transactions');
      }, 2000);
    }
  }, [paymentConfirmed, router]);

  const incrementQuantity = (id: number) => {
    setProductList((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id
          ? { ...product, quantity: product.quantity + 1 }
          : product
      )
    );
  };

  const decrementQuantity = (id: number) => {
    setProductList((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id && product.quantity > 1
          ? { ...product, quantity: product.quantity - 1 }
          : product
      )
    );
  };

  const handleDeliveryFeeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFee = parseFloat(event.target.value);
    if (!isNaN(newFee)) {
      setCurrentDeliveryFee(newFee);
    }
  };

  const calculateTotalPrice = () => {
    const productsTotal = productList.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );
    return productsTotal + serviceFee + currentDeliveryFee;
  };

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/payment/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          products: productList,
          amount: calculateTotalPrice().toFixed(2),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment link');
      }

      const data = await response.json();
      setPaymentLink(data.url);
      setReferenceCode(data.reference);
    } catch (err) {
      setError('Failed to create payment link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentConfirmation = async () => {
    if (!paymentLink || isConfirming) return; // Prevent multiple invocations

    setIsConfirming(true); // Start loading dialog

    try {
      if (referenceCode) {
        const response = await fetch('/api/verify-payment/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ reference: referenceCode }),
        });

        if (!response.ok) {
          throw new Error('Payment verification request failed');
        }

        const data = await response.json();
        if (data.success) {
          const transactionData = {
            products: productList,
            receiptNumber: data.receiptNumber,
            amount: (calculateTotalPrice()-serviceFee).toFixed(2),
            serviceFee: serviceFee,
            deliveryFee: currentDeliveryFee,
            status: 'Completed',
            validated: false,
            referenceCode: referenceCode,
            transactionDate: new Date().toISOString(),
          };

          const addTransactionResponse = await fetch('/api/transactions/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(transactionData),
          });

          if (!addTransactionResponse.ok) {
            throw new Error('Failed to add transaction');
          }

          setPaymentConfirmed(true);
        } else {
          setError('Payment verification failed. Please try again.');
        }
      } else {
        setError('Payment reference not found in the payment link.');
      }
    } catch (err) {
      setError('Payment verification failed. Please try again.');
    } finally {
      setIsConfirming(false); // Dismiss loading dialog
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-4">Checkout</h1>
      <div className="grid gap-6 mb-6">
        {productList.map((product) => (
          <div key={product.id} className="p-4 border rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
            <p className="text-gray-700 mb-2">Price: KES {product.price.toFixed(2)}</p>
            <p data-testid={`product-quantity-${product.id}`} className="mb-2">Quantity: {product.quantity}</p>
            <div className="flex gap-2">
              <button
                data-testid={`increment-button-${product.id}`}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => incrementQuantity(product.id)}
              >
                +
              </button>
              <button
                data-testid={`decrement-button-${product.id}`}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={() => decrementQuantity(product.id)}
              >
                -
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-200 mt-6">
        <p className="text-lg font-semibold mb-2">Service Fee: KES {serviceFee.toFixed(2)}</p>
        <div className="mb-4">
          <label htmlFor="delivery-fee" className="block text-lg font-semibold mb-2">
            Delivery Fee:
          </label>
          <input
            id="delivery-fee"
            type="number"
            value={currentDeliveryFee}
            onChange={handleDeliveryFeeChange}
            className="border rounded-lg px-3 py-2 w-full"
            step="0.01"
            min="0"
          />
        </div>
        <h2 data-testid="total-price" className="text-2xl font-bold">
          Total: KES {calculateTotalPrice().toFixed(2)}
        </h2>
        <button
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          aria-label="Checkout"
          onClick={handleCheckout}
        >
          Checkout
        </button>
      </div>

      {/* Conditional Rendering of Dialogs */}
      {loading && !error && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <p>Loading...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <p className="text-red-500">{error}</p>
            <button
              className="mt-2 px-4 py-2 bg-gray-200 rounded-md"
              onClick={() => setError(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {!loading && !error && paymentLink && !paymentConfirmed && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <p>Payment Link: <a href={paymentLink} target="_blank" rel="noopener noreferrer" className="text-blue-500">{paymentLink}</a></p>
            <button
              className="mt-2 px-4 py-2 bg-gray-200 rounded-md"
              onClick={handlePaymentConfirmation}
            >
              I have completed the payment
            </button>
           
          </div>
        </div>
      )}

      {!loading && !error && paymentConfirmed && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <Confetti />
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <p className="text-green-500">Payment was successful! Thank you for your purchase.</p>
            <button
              className="mt-2 px-4 py-2 bg-gray-200 rounded-md"
              onClick={() => setPaymentConfirmed(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {isConfirming && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <p>Confirming payment...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
