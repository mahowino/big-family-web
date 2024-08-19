"use client";

import React, { useState } from "react";
import { Transaction } from "../Transactions";
import { useRouter } from "next/navigation";
import ReceiptModal from "../ReceiptModal";

interface TransactionsTableProps {
  transactions: Transaction[];
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const pendingTransactions = transactions.filter(
    (transaction) => transaction.status === "Pending"
  );

  const completedTransactions = transactions.filter(
    (transaction) => transaction.status === "Completed"
  );

  const archivedTransactions = transactions.filter(
    (transaction) => transaction.status === "Invoiced"
  );

  // Calculate the total amount of validated completed transactions
  const totalValidatedAmount = completedTransactions
    .filter((transaction) => transaction.validated)
    .reduce((total, transaction) => {
      const amount = parseFloat(transaction.amount.replace(/[$,]/g, ''));
      return total + amount;
    }, 0);

  const handleValidatePayment = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  const handleSubmitReceiptNumber = async (receiptNumber: string) => {
    if (!selectedTransaction) return;
    setIsModalOpen(false);

    try {
   
      if (selectedTransaction.referenceCode) {
        const response = await fetch('/api/verify-payment/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ reference: selectedTransaction.referenceCode }),
        });

        const data=await response.json();
        const receiptFromPaystack=data.receiptNumber;
        
        if(receiptFromPaystack == receiptNumber)
        {
        const transactionData = {
            receiptNumber: data.receiptNumber,
            id:selectedTransaction.id,
            status: 'Completed',
            validated: true,
          };

          const updateTransactionResponse = await fetch('/api/transactions/', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(transactionData),
          });
           
          if (!updateTransactionResponse.ok) {
             alert('An error occured');
            throw new Error('Failed to add transaction');
            
          }
            alert('Transaction has been validated, please refresh the page');
        }
        else{
            alert('The receipt entered is  wrong');
        }

        if (!response.ok) {
          throw new Error('Payment verification request failed');
        }
    }
    else {
        alert('Payment validation failed');
    }

    
      handleCloseModal();
    } catch (error) {
        console.log(error)
      alert('Failed to validate payment');
    }
  };

  const maskReceiptNumber = (receiptNumber: string, validated: boolean) => {
    if (validated) {
      return receiptNumber;
    }
    return receiptNumber.replace(/.(?=.{4})/g, '*'); 
  };

  const handleGenerateInvoice=()=>{
    if(totalValidatedAmount>0){
        router.push("/invoice")
    }

  }

  const renderTable = (title: string, transactions: Transaction[], showGenerateInvoice = false) => (
    <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
      <div className="flex items-center justify-between px-6 py-4 bg-gray-50">
        <h3 className="font-medium text-gray-900">{title}</h3>
        {showGenerateInvoice && (
          <button
            onClick={handleGenerateInvoice}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            disabled={totalValidatedAmount === 0}
          >
            Generate Invoices (KES {totalValidatedAmount.toFixed(2)})
          </button>
        )}
      </div>
      <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 font-medium text-gray-900">Receipt Number</th>
            <th className="px-6 py-4 font-medium text-gray-900">Transaction Date</th>
            <th className="px-6 py-4 font-medium text-gray-900">Reference Code</th>
            <th className="px-6 py-4 font-medium text-gray-900">Amount</th>
            <th className="px-6 py-4 font-medium text-gray-900">Status</th>
             <th className="px-6 py-4 font-medium text-gray-900">Verified</th>
            <th className="px-6 py-4 font-medium text-gray-900"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 border-t border-gray-100">
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 font-normal text-gray-900">
                {maskReceiptNumber(transaction.receiptNumber, transaction.validated)}
              </td>
              <td className="px-6 py-4">{transaction.transactionDate}</td>
              <td className="px-6 py-4">{transaction.referenceCode}</td>
              <td className="px-6 py-4">{transaction.amount}</td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center gap-1 rounded-full ${
                    transaction.status === "Completed"
                      ? "bg-green-50 text-green-600"
                      : transaction.status === "Invoiced"
                      ? "bg-yellow-50 text-yellow-600"
                      : "bg-red-50 text-red-600"
                  } px-2 py-1 text-xs font-semibold`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      transaction.status === "Completed"
                        ? "bg-green-600"
                        : transaction.status === "Invoiced"
                        ? "bg-yellow-600"
                        : "bg-red-600"
                    }`}
                  ></span>
                  {transaction.status}
                </span>
              </td>
                 <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center gap-1 rounded-full ${
                    transaction.validated === true
                      ? "bg-green-50 text-green-600"
                      : transaction.status === "Invoiced"
                      ? "bg-yellow-50 text-yellow-600"
                      : "bg-red-50 text-red-600"
                  } px-2 py-1 text-xs font-semibold`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      transaction.validated === true
                        ? "bg-green-600"
                        : transaction.status === "Invoiced"
                        ? "bg-yellow-600"
                        : "bg-red-600"
                    }`}
                  ></span>
                 {transaction.validated?'Validated':'Not Validated'}
                  
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-end gap-4">
                  {transaction.status === "Completed" && !transaction.validated && (
                    <button
                      className="text-green-600 hover:underline"
                      onClick={() => handleValidatePayment(transaction)}
                    >
                      Validate Payment
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      {pendingTransactions.length > 0 &&
        renderTable("Pending Payments", pendingTransactions)}
      {completedTransactions.length > 0 &&
        renderTable("Completed Payments", completedTransactions, true)}
      {archivedTransactions.length > 0 &&
        renderTable("Archived Payments", archivedTransactions)}

      <ReceiptModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitReceiptNumber}
      />
    </div>
  );
}
