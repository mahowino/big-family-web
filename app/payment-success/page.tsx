// app/payment-success/page.tsx
import React, { useEffect, useState } from 'react';

const PaymentSuccess: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [paymentVerified, setPaymentVerified] = useState(false);

  useEffect(() => {
    // Extract the reference from the URL
    const queryParams = new URLSearchParams(window.location.search);
    const reference = queryParams.get('reference');

    if (reference) {
      verifyPayment(reference);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyPayment = async (reference: string) => {
    try {
      const response = await fetch('/api/verify-payment/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reference }),
      });
      const data=await response.json();
      const receiptFromPaystack=data.receiptNumber;

      if (response.ok) {
        setPaymentVerified(true);
      } else {
        setPaymentVerified(false);
      }
    } catch {
      setPaymentVerified(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {loading && <p>Loading...</p>}
      {!loading && paymentVerified && <p>Payment was successful! Thank you for your purchase.</p>}
      {!loading && !paymentVerified && <p>Payment failed or was not completed. Please try again.</p>}
    </div>
  );
};

export default PaymentSuccess;
