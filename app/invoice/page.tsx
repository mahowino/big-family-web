"use client";
import React, { useEffect, useState, useRef } from "react";
import ReactToPrint from "react-to-print";
import { useReactToPrint } from 'react-to-print';
import Confetti from 'react-confetti'; // Import the confetti component
import { useRouter } from 'next/navigation';
import { withAuth } from "@/hoc/withAuth"; // Import your withAuth HOC

interface Transaction {
  id: string;
  referenceCode: string;
  receiptNumber: string;
  transactionDate: string;
  amount: string;
  status: string;
  validated: boolean;
}

const withdrawalPercent=3;

const InvoiceContent = React.forwardRef(({ transactions, totalAmount, netAmount }: any, ref: any) => (
  <div ref={ref}>
    <header className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h1 className="text-2xl font-bold text-gray-900">Invoice Summary</h1>
    </header>

    <main className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Validated Transactions</h2>
      {transactions.length === 0 ? (
        <p className="text-gray-500">No validated transactions found.</p>
      ) : (
        <div>
          <table className="w-full border-collapse overflow-x-auto bg-white text-left text-sm text-gray-500">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 font-medium text-gray-900">Receipt Number</th>
                <th className="px-4 py-2 font-medium text-gray-900">Amount</th>
                <th className="px-4 py-2 font-medium text-gray-900">Reference Code</th>
                <th className="px-4 py-2 font-medium text-gray-900">Status</th>
                <th className="px-4 py-2 font-medium text-gray-900">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((transaction: Transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 font-normal text-gray-900">{transaction.receiptNumber}</td>
                  <td className="px-4 py-2">{transaction.amount}</td>
                  <td className="px-4 py-2">{transaction.referenceCode}</td>
                  <td className="px-4 py-2">{transaction.status}</td>
                  <td className="px-4 py-2">{transaction.transactionDate}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6">
            <div className="flex justify-between font-semibold text-gray-900">
              <span>Total Amount:</span>
              <span>KES {totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-gray-900">
              <span>Transaction cost:</span>
              <span>-  KES {(totalAmount * (withdrawalPercent / 100)).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-gray-900">
              <span>Net Amount:</span>
              <span>KES {netAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </main>
  </div>
));

function InvoicePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [netAmount, setNetAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [confirmDisabled, setConfirmDisabled] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const componentRef = useRef(null);
  const router = useRouter();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Invoice',
  });

  useEffect(() => {
    // Fetch validated transactions
    async function fetchValidatedTransactions() {
      try {
        const response = await fetch('/api/transactions');
        const data = await response.json();
        const validatedTransactions = data.filter((transaction: Transaction) => transaction.validated && transaction.status === 'Completed');
        setTransactions(validatedTransactions);

        // Calculate total amount
        const total = validatedTransactions.reduce((sum:any, transaction:any) => {
          const amount = parseFloat(transaction.amount.replace(/[$,]/g, ''));
          return sum + amount;
        }, 0);
        
        setTotalAmount(total);

        // Calculate net amount after fixed cost
        const fixedCostPercentage = withdrawalPercent; // 3% of the total amount
        const net = total - (total * (fixedCostPercentage / 100));
        setNetAmount(net);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    }

    fetchValidatedTransactions();
  }, []);

  const handleConfirm = async () => {
    setLoading(true);
    setConfirmDisabled(true);

    try {
      const response = await fetch('/api/confirm-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionIds: transactions.map(transaction => transaction.id),
          referenceCodes: transactions.map(transaction => transaction.referenceCode),
          netAmount:netAmount,
          totalAmount:totalAmount,
          transactionCost:((totalAmount*withdrawalPercent)/100)
        }),
      });

      if (response.ok) {
        console.log('Invoice confirmed and transactions updated successfully');
        setShowConfetti(true);
        setTimeout(() => {
          router.push('/transactions');
        }, 3000); // Delay for confetti
      } else {
        console.error('Error confirming invoice:', await response.json());
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-200 p-6">
      <div className="flex justify-end mb-4">
        <button
          onClick={handlePrint}
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
        >
          Print Invoice
        </button>
      </div>

      <InvoiceContent
        ref={componentRef}
        transactions={transactions}
        totalAmount={totalAmount}
        netAmount={netAmount}
      />

      {showConfetti && <Confetti />}

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleConfirm}
          className={`bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 ${confirmDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
          disabled={confirmDisabled}
        >
          {loading ? 'Confirming...' : 'Confirm'}
        </button>
      </div>
    </div>
  );
}
export default  withAuth(InvoicePage);