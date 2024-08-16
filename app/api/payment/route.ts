import { NextResponse } from "next/server";

// Handle POST requests
export async function POST(request: Request) {
  try {
    const { amount, products } = await request.json();

    // Define your Paystack API key and endpoint
    const PAYSTACK_SECRET_KEY =
      "sk_test_73a0409ef54b1527abb426918f17c9b5127c847f";
    const PAYSTACK_API_URL = "https://api.paystack.co/transaction/initialize";

    // Prepare the Paystack request
    const response = await fetch(PAYSTACK_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount * 100, // Amount in kobo
        email: "customer@example.com",
        metadata: {
          products,
        },
      }),
    });

    const data = await response.json();
    console.log(data);

    if (data.status) {
      return NextResponse.json({
        url: data.data.authorization_url,
        reference: data.data.reference,
      });
    } else {
      return NextResponse.json({ error: data.message }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
