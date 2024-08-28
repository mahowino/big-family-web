import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { reference } = await request.json();
    console.log(reference);

    const PAYSTACK_SECRET_KEY =
      "sk_live_76e4619a097597ea2835e6da74b1025da9014892";
    const PAYSTACK_API_URL = `https://api.paystack.co/transaction/verify/${reference}`;

    const response = await fetch(PAYSTACK_API_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });

    const data = await response.json();
    console.log(data);

    if (data.status && data.data.status === "success") {
      return NextResponse.json({
        success: true,
        receiptNumber: data.data.receipt_number,
        reference: reference,
        amount: 9900,
      });
    } else {
      return NextResponse.json({ success: false }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
