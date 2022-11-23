const { CLIENT_ID, APP_SECRET } = process.env;
const fetch = require("node-fetch");
const base = "https://api-m.sandbox.paypal.com";

// generate an access token using client id and app secret
async function generateAccessToken() {
  const auth = Buffer.from(CLIENT_ID + ":" + APP_SECRET).toString("base64");
  const response = await fetch(`${base}/v1/oauth2/token`, {
    method: "post",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });
  const data = await response.json();
  return data.access_token;
}
module.exports = {
  // use the orders api to create an order
  createOrder: async (totalAmount) => {
    totalAmount = Math.round(totalAmount * 100) / 100;
    let totalUSD = totalAmount / 80;
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders`;
    const response = await fetch(url, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: totalUSD,
            },
          },
        ],
      }),
    });
    const data = await response.json();
    return data;
  }, 

  // use the orders api to capture payment for an order
  capturePayment: async (orderId) => {
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders/${orderId}/capture`;
    const response = await fetch(url, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    return data;
  },
};
