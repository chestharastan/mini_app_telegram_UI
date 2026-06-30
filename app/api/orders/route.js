import { NextResponse } from "next/server";
import crypto from "node:crypto";

const BACKEND_BASE_URL =
  process.env.API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:8000";

function normalizePhoneNumber(value) {
  return String(value ?? "")
    .trim()
    .replace(/[^\d+]/g, "")
    .replace(/(?!^)\+/g, "");
}

function isValidPhoneNumber(value) {
  const digitCount = normalizePhoneNumber(value).replace(/\D/g, "").length;

  return digitCount >= 7 && digitCount <= 15;
}

function createStableWebUserId(phoneNumber) {
  const hash = crypto.createHash("sha256").update(phoneNumber).digest("hex");
  return 1000000000 + (parseInt(hash.slice(0, 8), 16) % 900000000);
}

function getCustomerPhone(body) {
  return normalizePhoneNumber(
    body.customerPhone ?? body.customer_phone ?? body.phone
  );
}

function createSignedInitData(botToken, user) {
  const now = Date.now();
  const fields = {
    auth_date: String(Math.floor(now / 1000)),
    query_id: `web-${now}`,
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

function createWebCheckoutInitData(botToken, phoneNumber) {
  const user = {
    id: createStableWebUserId(phoneNumber),
    first_name: `Web Customer ${phoneNumber}`,
    last_name: "Vercel checkout",
    username: "web_checkout",
    language_code: process.env.DEV_TELEGRAM_LANGUAGE_CODE ?? "en",
  };

  return createSignedInitData(botToken, user);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const orderPayload = { ...body };
    const customerPhone = getCustomerPhone(body);
    const hasTelegramInitData = Boolean(orderPayload.initData);

    if (!isValidPhoneNumber(customerPhone) && !hasTelegramInitData) {
      return NextResponse.json(
        { error: "A valid customer phone number is required." },
        { status: 400 }
      );
    }

    if (isValidPhoneNumber(customerPhone)) {
      orderPayload.customerPhone = customerPhone;
    }

    if (!orderPayload.initData) {
      if (!process.env.BOT_TOKEN) {
        return NextResponse.json(
          {
            error:
              "Checkout needs BOT_TOKEN configured on the server to create web orders.",
          },
          { status: 500 }
        );
      }

      orderPayload.initData = createWebCheckoutInitData(
        process.env.BOT_TOKEN,
        customerPhone
      );
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
