import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const EXPRESS_API_URL = `http://localhost:${
  process.env.SERVER_PORT || 3001
}/api`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("🏴‍☠️ Next.js API Route - Creating wedding invitation:", body);
    console.log(
      "🏴‍☠️ Calling Express API at:",
      `${EXPRESS_API_URL}/wedding-invitations`
    );

    const response = await axios.post(
      `${EXPRESS_API_URL}/wedding-invitations`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000, // 10 second timeout
      }
    );

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error(
      "❌ Next.js API Route - Error creating wedding invitation:",
      error
    );

    if (error.response) {
      return NextResponse.json(error.response.data, {
        status: error.response.status,
      });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
