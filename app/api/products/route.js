import { NextResponse } from "next/server";

const BACKEND_BASE_URL =
  process.env.API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:8000";

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/products`, {
      headers: { accept: "application/json" },
      cache: "no-store",
    });
    const payload = await response.json();

    return NextResponse.json(payload, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to proxy products request",
      },
      { status: 500 }
    );
  }
}