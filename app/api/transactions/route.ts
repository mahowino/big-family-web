// app/api/transactions/route.ts
import { NextResponse } from "next/server";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/firebase.config";

const transactionsCollection = collection(db, "transactions");

// GET: Fetch transactions
export async function GET() {
  try {
    const querySnapshot = await getDocs(transactionsCollection);
    const transactions = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json(transactions);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST: Add a new transaction
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      referenceCode,
      receiptNumber,
      transactionDate,
      products,
      amount,
      status,
      validated,
      serviceFee,
      deliveryFee,
    } = body;
    const docRef = await addDoc(transactionsCollection, {
      referenceCode,
      receiptNumber,
      transactionDate,
      amount,
      status,
      validated,
      products,
      serviceFee,
      deliveryFee,
    });
    return NextResponse.json({ id: docRef.id, ...body }, { status: 201 });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT: Update an existing transaction
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status, validated } = body;
    const docRef = doc(db, "transactions", id);
    await updateDoc(docRef, {
      status,
      validated,
    });
    return NextResponse.json({
      id,

      status,
      validated,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a transaction
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;
    const docRef = doc(db, "transactions", id);
    await deleteDoc(docRef);
    return NextResponse.json({ message: "Transaction deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
