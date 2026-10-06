const API_URL = "https://api-checkout.cinetpay.com/v2/payment";

export function isCinetPayConfigured() {
  return Boolean(
    process.env.CINETPAY_API_KEY &&
      process.env.CINETPAY_SITE_ID &&
      process.env.APP_PUBLIC_URL,
  );
}

function getPublicUrls(reference) {
  const baseUrl = new URL(process.env.APP_PUBLIC_URL);
  if (process.env.NODE_ENV === "production" && baseUrl.protocol !== "https:") {
    throw new Error("APP_PUBLIC_URL must use HTTPS in production.");
  }

  const notifyUrl = new URL("/api/payments/cinetpay/notify", baseUrl);
  const returnUrl = new URL("/", baseUrl);
  returnUrl.searchParams.set("payment", "return");
  returnUrl.searchParams.set("reference", reference);

  return { notifyUrl: notifyUrl.href, returnUrl: returnUrl.href };
}

async function post(path, payload, fetchImpl = fetch) {
  let response;
  try {
    response = await fetchImpl(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000),
    });
  } catch (error) {
    throw new Error(`CinetPay is unreachable: ${error.message}`);
  }

  let result;
  try {
    result = await response.json();
  } catch {
    throw new Error(`CinetPay returned an invalid response (HTTP ${response.status}).`);
  }
  if (!response.ok) {
    throw new Error(`CinetPay rejected the request (HTTP ${response.status}, code ${result.code ?? "unknown"}).`);
  }
  return result;
}

export async function initializeCinetPayCheckout(order, fetchImpl = fetch) {
  if (!isCinetPayConfigured()) {
    throw new Error("Configure CINETPAY_API_KEY, CINETPAY_SITE_ID and APP_PUBLIC_URL.");
  }
  const { notifyUrl, returnUrl } = getPublicUrls(order.reference);
  const result = await post(
    "",
    {
      apikey: process.env.CINETPAY_API_KEY,
      site_id: process.env.CINETPAY_SITE_ID,
      transaction_id: order.reference,
      amount: order.total,
      currency: "XOF",
      description: `${order.type === "rental" ? "Location" : "Achat"} : ${order.productName}`,
      return_url: returnUrl,
      notify_url: notifyUrl,
      channels: "MOBILE_MONEY",
      lang: "fr",
      customer_id: order.reference,
      customer_name: order.customer.firstName,
      customer_surname: order.customer.lastName,
      customer_email: order.customer.email,
      customer_phone_number: order.customer.phone,
      customer_address: order.customer.city,
      customer_city: order.customer.city,
      customer_country: "CI",
      customer_state: order.customer.city,
      customer_zip_code: "00000",
    },
    fetchImpl,
  );

  const paymentUrl = result.data?.payment_url;
  if (String(result.code) !== "201" || typeof paymentUrl !== "string") {
    throw new Error(`CinetPay did not create the checkout (code ${result.code ?? "unknown"}).`);
  }

  return paymentUrl;
}

export async function verifyCinetPayTransaction(transactionId, fetchImpl = fetch) {
  if (!isCinetPayConfigured()) {
    throw new Error("CinetPay is not configured.");
  }
  const result = await post(
    "/check",
    {
      apikey: process.env.CINETPAY_API_KEY,
      site_id: process.env.CINETPAY_SITE_ID,
      transaction_id: transactionId,
    },
    fetchImpl,
  );
  if (String(result.code) !== "00" || !result.data) {
    throw new Error(`CinetPay could not verify transaction ${transactionId} (code ${result.code ?? "unknown"}).`);
  }
  return result.data;
}
