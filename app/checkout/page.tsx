"use client";

import CheckoutPage from "@/components/screens/CheckoutPage";
import { useSearchParams } from 'next/navigation'; // Use this instead of useRouter
import Image from "next/image";

export default function Home() {
  const searchParams = useSearchParams();
  
  // Extract query parameters
  const products = searchParams.get('products');
  const serviceFee = searchParams.get('serviceFee');
  const deliveryFee = searchParams.get('deliveryFee');

  // Parse query parameters
  const parsedProducts = products ? JSON.parse(products) : [];
  const parsedServiceFee = serviceFee ? parseFloat(serviceFee) : 0;
  const parsedDeliveryFee = deliveryFee ? parseFloat(deliveryFee) : 0;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 text-black bg-slate-200">
      <CheckoutPage
        products={parsedProducts}
        serviceFee={5}
        deliveryFee={parsedDeliveryFee}
      />
    </main>
  );
}
