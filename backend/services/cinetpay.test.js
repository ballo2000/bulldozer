import test from "node:test";
import assert from "node:assert/strict";
import { initializeCinetPayCheckout, verifyCinetPayTransaction } from "./cinetpay.js";

const originalEnv = {
  CINETPAY_API_KEY: process.env.CINETPAY_API_KEY,
  CINETPAY_SITE_ID: process.env.CINETPAY_SITE_ID,
  APP_PUBLIC_URL: process.env.APP_PUBLIC_URL,
  NODE_ENV: process.env.NODE_ENV,
};

function setTestEnvironment() {
  process.env.CINETPAY_API_KEY = "test-api-key";
  process.env.CINETPAY_SITE_ID = "123456";
  process.env.APP_PUBLIC_URL = "https://machines.example.test";
  process.env.NODE_ENV = "test";
}

function mockResponse(body, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  };
}

test.after(() => {
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

test("initializes an XOF Mobile Money checkout and returns the provider URL", async () => {
  setTestEnvironment();
  let request;
  const paymentUrl = await initializeCinetPayCheckout(
    {
      reference: "IM-0123456789ABCDEF",
      total: 98500000,
      type: "purchase",
      productName: "Caterpillar D6T",
      customer: {
        firstName: "Awa",
        lastName: "Kone",
        phone: "+2250700000000",
        email: "awa@example.test",
        city: "Abidjan",
      },
    },
    async (url, options) => {
      request = { url, body: JSON.parse(options.body) };
      return mockResponse({ code: "201", data: { payment_url: "https://checkout.cinetpay.com/secure" } });
    },
  );

  assert.equal(paymentUrl, "https://checkout.cinetpay.com/secure");
  assert.equal(request.url, "https://api-checkout.cinetpay.com/v2/payment");
  assert.equal(request.body.amount, 98500000);
  assert.equal(request.body.currency, "XOF");
  assert.equal(request.body.channels, "MOBILE_MONEY");
  assert.equal(request.body.customer_name, "Awa");
  assert.equal(request.body.customer_surname, "Kone");
  assert.equal(request.body.customer_email, "awa@example.test");
  assert.equal(request.body.notify_url, "https://machines.example.test/api/payments/cinetpay/notify");
  assert.match(request.body.return_url, /reference=IM-0123456789ABCDEF/);
  assert.equal(request.body.apikey, "test-api-key");
});

test("rejects a checkout when CinetPay does not return a payment URL", async () => {
  setTestEnvironment();
  await assert.rejects(
    initializeCinetPayCheckout(
      {
        reference: "IM-0123456789ABCDEF",
        total: 1000,
        type: "purchase",
        productName: "Bulldozer",
        customer: {
          firstName: "Awa",
          lastName: "Kone",
          phone: "0700000000",
          email: "awa@example.test",
          city: "Abidjan",
        },
      },
      async () => mockResponse({ code: "400", message: "Invalid site" }),
    ),
    /did not create the checkout/,
  );
});

test("verifies a transaction server-to-server with the configured site", async () => {
  setTestEnvironment();
  let body;
  const data = await verifyCinetPayTransaction("IM-0123456789ABCDEF", async (url, options) => {
    body = JSON.parse(options.body);
    assert.equal(url, "https://api-checkout.cinetpay.com/v2/payment/check");
    return mockResponse({
      code: "00",
      data: { transaction_id: "IM-0123456789ABCDEF", amount: "1000", currency: "XOF", status: "ACCEPTED" },
    });
  });

  assert.equal(body.transaction_id, "IM-0123456789ABCDEF");
  assert.equal(body.site_id, "123456");
  assert.equal(data.status, "ACCEPTED");
});
