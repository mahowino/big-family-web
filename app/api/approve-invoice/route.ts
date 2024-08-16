// app/api/confirm-invoice/route.ts

import { NextResponse } from "next/server";
import { runTransaction, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase.config";

export async function POST(request: Request) {
  const { invoiceId, transactionIds } = await request.json();

  if (
    !invoiceId ||
    !Array.isArray(transactionIds) ||
    transactionIds.length === 0
  ) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const invoiceRef = doc(db, "invoices", invoiceId);

  try {
    await runTransaction(db, async (transaction) => {
      // Update the invoice status to "Approved"
      const invoiceSnapshot = await transaction.get(invoiceRef);
      if (!invoiceSnapshot.exists()) {
        throw new Error("Invoice does not exist");
      }

      const invoiceData = invoiceSnapshot.data();
      if (invoiceData.status !== "Pending") {
        throw new Error("Invoice is not in Pending status");
      }

      transaction.update(invoiceRef, { status: "Approved" });

      // Delete the transaction documents
      for (const transactionId of transactionIds) {
        const transactionRef = doc(db, "transactions", transactionId);
        transaction.delete(transactionRef);
      }
    });

    return NextResponse.json({
      message: "Invoice approved and transactions deleted successfully",
    });
  } catch (error) {
    console.error("Error approving invoice:", error);
    return NextResponse.json(
      { error: "Failed to approve invoice" },
      { status: 500 }
    );
  }
}
