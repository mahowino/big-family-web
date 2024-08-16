// app/api/invoices/route.ts

import { NextResponse } from "next/server";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase.config";

export async function GET() {
  try {
    const invoicesRef = collection(db, "invoices");
    const querySnapshot = await getDocs(invoicesRef);

    const invoices = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(invoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json(
      { error: "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}
