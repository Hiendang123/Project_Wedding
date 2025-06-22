import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const EXPRESS_API_URL = `http://localhost:${
  process.env.SERVER_PORT || 3001
}/api`;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const { slug } = await params;

    let url = `${EXPRESS_API_URL}/wedding-invitations/${slug}`;

    // Forward query parameters
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    console.log("🏴‍☠️ Fetching wedding invitation:", url);

    const response = await axios.get(url);
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error(
      "❌ Next.js API Route - Error fetching wedding invitation:",
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
