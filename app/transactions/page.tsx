"use client";

import { useEffect, useState } from "react";
import { TransactionsTable } from "@/components/screens/TransactionsPage";
import { Transaction } from "@/components/Transactions";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/loadingScreen";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase.config";
import { withAuth } from "@/hoc/withAuth";
import { FaBars } from "react-icons/fa";


 function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router=useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false); // State to manage sidebar visibility


  const handleLogout = async () => {
  try {
    await signOut(auth);
    console.log("User logged out successfully");
    router.push("/");
    // Redirect to a different page or update your app state
  } catch (error) {
    console.error("Error logging out:", error);
  }
};
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('/api/transactions',{cache:'no-store'});
        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }
        const data = await response.json();
        setTransactions(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) return <LoadingScreen/>;
  if (error) return <div className="p-10 text-red-500">Error: {error}</div>;

   const handleNewTransaction = () => {
    router.push("/product");
  };
  return (
     <div className="flex min-h-screen w-full bg-slate-200 text-black">
      {/* Sidebar */}
      <aside className={`fixed lg:static w-64 bg-gray-800 text-white flex flex-col p-4 transition-transform transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 z-50`}>
        <div className="text-xl font-bold mb-6">Dashboard</div>
        <nav className="flex flex-col gap-4">
          <a href="/transactions/overview" className="hover:bg-gray-700 p-2 rounded">Overview</a>
          <a href="/transactions" className="hover:bg-gray-700 p-2 rounded">Transactions</a>
          <a href="/transactions/archived" className="hover:bg-gray-700 p-2 rounded">Invoices</a>
          <button
            onClick={handleLogout}
            className="mt-auto bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </nav>
        <div className="mt-auto text-sm">
          <p className="text-gray-400">Logged in as:</p>
          <p className="font-semibold">Username</p>
        </div>
      </aside>

      {/* Sidebar toggle button */}
      <button
        className="lg:hidden fixed top-4 left-4 bg-gray-800 text-white p-2 rounded-full z-50"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <FaBars />
      </button>
      {/* Main Content */}
      <main className="flex-1 p-10">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold">Transactions</h1>
          <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700" onClick={handleNewTransaction}>
            New Transaction
          </button>
        </header>

        {/* Transactions Table */}
        <section className="bg-white p-6 rounded-lg shadow-lg">
          <TransactionsTable transactions={transactions} />
        </section>
      </main>
    </div>
  );
}
export default withAuth(Transactions);