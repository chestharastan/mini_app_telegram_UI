import { NextResponse } from "next/server";
import crypto from "node:crypto";

const BACKEND_BASE_URL =
  process.env.API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:8000";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

function isLocalDevelopmentRequest(request) {
  if (process.env.NODE_ENV === "production") return false;

  const hostHeader = request.headers.get("host") ?? "";
  const host = hostHeader.startsWith("[")
    ? hostHeader.slice(1, hostHeader.indexOf("]"))
    : hostHeader.split(":")[0];

  return LOCAL_HOSTS.has(host);
}

function createDevelopmentInitData(botToken) {
  const user = {
    id: Number(process.env.DEV_TELEGRAM_USER_ID ?? 100000001),
    first_name: process.env.DEV_TELEGRAM_FIRST_NAME ?? "Local",
    last_name: process.env.DEV_TELEGRAM_LAST_NAME ?? "Shopper",
    username: process.env.DEV_TELEGRAM_USERNAME ?? "local_shopper",
    language_code: process.env.DEV_TELEGRAM_LANGUAGE_CODE ?? "en",
  };

  const fields = {
    auth_date: String(Math.floor(Date.now() / 1000)),
    query_id: `dev-${Date.now()}`,
    user: JSON.stringify(user),
  };

  const dataCheckString = Object.keys(fields)
    .sort()
    .map((key) => `${key}=${fields[key]}`)
    .join("\n");

  const secretKey = crypto
    .createHmac("sha256", "WebAppData")
    .update(botToken)
    .digest();

  const hash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  const params = new URLSearchParams(fields);
  params.set("hash", hash);

  return params.toString();
}

export async function POST(request) {
  try {
    const body = await request.json();
    const orderPayload = { ...body };

    if (!orderPayload.initData && isLocalDevelopmentRequest(request)) {
      if (!process.env.BOT_TOKEN) {
        return NextResponse.json(
          {
            error:
              "Local browser checkout needs BOT_TOKEN in web-ecommerce/.env.local, or open this shop inside Telegram.",
          },
          { status: 500 }
        );
      }

      orderPayload.initData = createDevelopmentInitData(process.env.BOT_TOKEN);
    }

    const response = await fetch(`${BACKEND_BASE_URL}/api/orders`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderPayload),
      cache: "no-store",
    });

    const text = await response.text();
    let payload = {};

    if (text) {
      try {
        payload = JSON.parse(text);
      } catch {
        payload = { error: text };
      }
    }

    return NextResponse.json(payload, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to proxy orders request",
      },
      { status: 500 }
    );
  }
}
