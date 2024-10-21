require("dotenv").config();
const { axios } = require("axios");
const { response } = require("express");
const { use } = require("../routes/auth");

const checkoutOrder = async (req, res = response) => {
  const order = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amout: {
          currency_code: "MXN",
          value: "10.00",
        },
      },
    ],
    application_context: {
      brand_name: "BRAND DUMMY",
      landing_page: "NO_PREFERENCE",
      user_action: "PAY_NOW",
      return_url: `${process.env.HOST}/api/payments/createOrder`,
      cancel_url: `${process.env.HOST}/api/payments/cancelOrder`,
    },
  };

  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");

  // AUTH REQUEST
  const { data: { access_token } } = await axios.post(`${process.env.PAYPAL_SANDBOX_URL}/v1/oauth2/token`,
    params,
    {
      auth: {
        username: process.env.PAYPAL_API_CLIENT,
        password: process.env.PAYPAL_API_SECRET,
      },
    }
  );

  const resp = await axios.post(`${process.env.PAYPAL_SANDBOX_URL}/v2/checkout/orders`, order, {
    headers: {
        Authorization: `Bearer ${access_token}`
    }
  })

  // console.log(resp.data)
  return res.json(resp.data)
};

const checkoutSuccess = async(req, res = response) => {
  const {token} = req.query
  const resp = await axios.post(`${process.env.PAYPAL_SANDBOX_URL}/v2/checkout/orders/${token}/capture`,{}, {
    auth:{
        username:process.env.PAYPAL_API_CLIENT,
        password:process.env.PAYPAL_API_SEVRET,
    }
  })
  console.log(resp.data)
  alert('Gracias por tu compra <3')
};
const cancelCheckout = (req, res = response) => {
  res.redirect('/')
};

module.exports = { checkoutOrder, checkoutSuccess, cancelCheckout };
