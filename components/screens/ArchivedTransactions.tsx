"use client";
import { useEffect, useState } from 'react';
import LoadingScreen from '../loadingScreen';
import { monitorAuthState } from '@/auth';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase.config';
import { useRouter } from 'next/navigation';
import { FaBars } from 'react-icons/fa';

interface Invoice {
  id: string;
  createdAt: string;
  status: string;
  transactions: string[];
  referenceCodes: string[];
  totalAmount: number;
  netAmount: number;
  transactionCost: number;
}

interface User {
  uid: string;
  email: string;
  role?: string;
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<string>("");
  const [confirmDialog, setConfirmDialog] = useState<{ visible: boolean; invoiceId: string } | null>(null);
  const [loadingApproval, setLoadingApproval] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // State to manage sidebar visibility

  const router = useRouter();

  useEffect(() => {
    monitorAuthState((user, userRole) => {
      setRole(userRole);
    });
  }, []);

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
    async function fetchInvoices() {
      try {
        const response = await fetch('/api/invoices',{ cache: 'no-store' });
        if (!response.ok) {
          throw new Error('Failed to fetch invoices');
        }
        const data = await response.json();
        setInvoices(data);
      } catch (error) {
        setError('Failed to fetch invoices');
      } finally {
        setLoading(false);
      }
    }

    fetchInvoices();
  }, []);

  const handleApprove = async (invoiceId: string) => {
    setConfirmDialog({ visible: true, invoiceId });
  };

  const confirmApproval = async () => {
    if (confirmDialog) {
      setLoadingApproval(true);
      try {
        const response = await fetch('/api/approve-invoice', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            invoiceId: confirmDialog.invoiceId,
            transactionIds: invoices.find(inv => inv.id === confirmDialog.invoiceId)?.transactions || [],
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to approve invoice');
        }

        const result = await response.json();
        console.log(result.message);

        setInvoices((prevInvoices) =>
          prevInvoices.map((invoice) =>
            invoice.id === confirmDialog.invoiceId ? { ...invoice, status: "Approved" } : invoice
          )
        );
        setConfirmDialog(null);
      } catch (error) {
        console.error('Failed to approve invoice:', error);
        setError('Failed to approve invoice');
      } finally {
        setLoadingApproval(false);
      }
    }
  };

  const cancelApproval = () => {
    setConfirmDialog(null);
  };

  if (loading) return <LoadingScreen />;
  if (error) return <p className="text-center text-red-500">{error}</p>;

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
      <main className="flex-1 p-4 lg:p-10">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold">Invoices</h1>
        </header>

        {/* Invoices Table */}
        <section className="bg-white p-6 rounded-lg shadow-lg">
          {invoices.length === 0 ? (
            <p className="text-gray-500">No invoices found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse bg-white text-left text-sm text-gray-500">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 font-medium text-gray-900">Invoice ID</th>
                    <th className="px-4 py-2 font-medium text-gray-900">Created At</th>
                    <th className="px-4 py-2 font-medium text-gray-900">Status</th>
                    <th className="px-4 py-2 font-medium text-gray-900">Transactions</th>
                    <th className="px-4 py-2 font-medium text-gray-900">Reference Codes</th>
                    <th className="px-4 py-2 font-medium text-gray-900">Total Amount</th>
                    <th className="px-4 py-2 font-medium text-gray-900">Transaction cost</th>
                    <th className="px-4 py-2 font-medium text-gray-900">Net Amount</th>
                    {role === "super-admin" && <th className="px-4 py-2 font-medium text-gray-900">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 font-normal text-gray-900">{invoice.id}</td>
                      <td className="px-4 py-2">{new Date(invoice.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                            invoice.status === 'Pending'
                              ? 'bg-yellow-200 text-yellow-800'
                              : 'bg-green-200 text-green-800'
                          }`}
                        >
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <ul>
                          {invoice.transactions.map(transactionId => (
                            <li key={transactionId}>{transactionId}</li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-4 py-2">
                        <ul>
                          {invoice.referenceCodes.map(referenceCode => (
                            <li key={referenceCode}>{referenceCode}</li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-4 py-2 font-normal text-gray-900">KES {invoice.totalAmount}</td>
                      <td className="px-4 py-2 font-normal text-gray-900">KES {invoice.transactionCost}</td>
                      <td className="px-4 py-2 font-normal text-gray-900">KES {invoice.netAmount}</td>
                      {role === "super-admin" && (
                        <td className="px-4 py-2">
                          {invoice.status === "Pending" && (
                            <button
                              onClick={() => handleApprove(invoice.id)}
                              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                            >
                              Approve
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Confirmation Dialog */}
        {confirmDialog && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Confirm Approval</h2>
              <p className="mb-4">Are you sure you want to approve this invoice? This will delete the related transactions.</p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={cancelApproval}
                  className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmApproval}
                  className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                >
                  {loadingApproval ? 'Approving...' : 'Approve'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
