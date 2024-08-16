"use client";

import { useEffect, useState } from "react";
import { Overview } from "@/components/screens/OverviewPage";
import { Transaction } from "@/components/Transactions";
import LoadingScreen from "@/components/loadingScreen";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase.config";
import { useRouter } from "next/navigation";
import { withAuth } from "@/hoc/withAuth"; // Import your withAuth HOC


function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router=useRouter();

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
        const response = await fetch('/api/transactions');
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

  return (
    <div className="flex min-h-screen bg-slate-200 text-black">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col p-4">
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

      {/* Main Content */}
      <main className="flex-1 p-10">
        <Overview transactions={transactions} />
      </main>
    </div>
  );
}
export default withAuth(Home);