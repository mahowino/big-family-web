"use client";

import { useEffect, useState } from "react";
import { Overview } from "@/components/screens/OverviewPage";
import { Transaction } from "@/components/Transactions";
import LoadingScreen from "@/components/loadingScreen";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase.config";
import { useRouter } from "next/navigation";
import { withAuth } from "@/hoc/withAuth";
import { FaBars } from "react-icons/fa"; // Import an icon for the sidebar toggle

function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // State to manage sidebar visibility
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out successfully");
      router.push("/");
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

  if (loading) return <LoadingScreen />;
  if (error) return <div className="p-10 text-red-500">Error: {error}</div>;

  return (
    <div className="flex min-h-screen bg-slate-200 text-black">
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
      <main className="flex-1 p-4">
        <Overview transactions={transactions} />
      </main>
    </div>
  );
}

export default withAuth(Home);
