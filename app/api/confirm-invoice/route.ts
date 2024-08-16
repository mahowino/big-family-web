// app/api/confirm-invoice/route.ts

import { NextResponse } from "next/server";
import { runTransaction, doc } from "firebase/firestore";
import { db } from "@/firebase.config";

export async function POST(request: Request) {
  const {
    transactionIds,
    referenceCodes,
    totalAmount,
    netAmount,
    transactionCost,
  } = await request.json();

  if (!Array.isArray(transactionIds) || transactionIds.length === 0) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const invoiceId = Date.now().toString(); // Use a more sophisticated ID in production
  const invoiceRef = doc(db, "invoices", invoiceId);

  try {
    await runTransaction(db, async (transaction) => {
      // Create a new invoice document
      const invoiceData = {
        createdAt: new Date().toISOString(),
        status: "Pending",
        transactions: transactionIds,
        referenceCodes: referenceCodes,
        totalAmount: totalAmount,
        netAmount: netAmount,
        transactionCost: transactionCost,
      };
      transaction.set(invoiceRef, invoiceData);

      for (const transactionId of transactionIds) {
        const transactionRef = doc(db, "transactions", transactionId);
        transaction.update(transactionRef, { status: "Invoiced" });
      }
    });

    return NextResponse.json({
      message: "Invoice created and transactions updated successfully",
    });
  } catch (error) {
    console.error("Error creating invoice:", error);
    return NextResponse.json(
      { error: "Failed to create invoice" },
      { status: 500 }
    );
  }
}
