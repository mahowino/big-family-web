"use client"
import ProductForm from "@/components/screens/ProductPage";
import { withAuth } from "@/hoc/withAuth"; // Import your withAuth HOC

function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 text-black bg-slate-200">
      <ProductForm />
    </main>
  );
}

export default withAuth(Home); // Wrap Home component with withAuth HOC
