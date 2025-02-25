const  axios  = require("axios");
const { response } = require("express");
const { use } = require("../routes/auth");
const PAYPAL_API_CLIENT = process.env.PAYPAL_API_CLIENT;
const PAYPAL_API_SECRET = process.env.PAYPAL_API_SECRET;
const PAYPAL_SANDBOX_URL = process.env.PAYPAL_SANDBOX_URL;

/*const getAccessToken = async (req, res = response) => {

  try {
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");

    const response = await axios.post(
      `${PAYPAL_SANDBOX_URL}/v1/oauth2/token`,
      params,
      {
        auth: {
          username: PAYPAL_API_CLIENT,
          password: PAYPAL_API_SECRET,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    res.json(response.data.access_token);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
};*/

/*const getAccessToken = async (req, res) => {
  try {
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");

    const response = await axios.post(
      `${PAYPAL_SANDBOX_URL}/v1/oauth2/token`,
      params,
      {
        auth: {
          username: PAYPAL_API_CLIENT,
          password: PAYPAL_API_SECRET,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    res.json({ access_token: response.data.access_token }); // Retorna un JSON con el token
    
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
};*/

const getAccessToken = async() => {
  try {
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");

    const response = await axios.post(
      `${PAYPAL_SANDBOX_URL}/v1/oauth2/token`,
      params,
      {
        auth: {
          username: PAYPAL_API_CLIENT,
          password: PAYPAL_API_SECRET,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data.access_token; // Retorna el access_token correctamente

  } catch (error) {
    throw new Error(error.response?.data || error.message); // Lanza un error en caso de fallo
  }
};

const checkoutOrder = async (access_token, data) => {
  try {
    const response = await axios.post(
      `${PAYPAL_SANDBOX_URL}/v2/checkout/orders`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${access_token}`,
          "Paypal-Request-Id": generateUUID(), // Evita duplicados
        },
      }
    );

    const order = response.data;

    // Buscar la URL de aprobación en los links de la respuesta
    const approveLink = order.links?.find(link => link.rel === "approve");

    if (!approveLink) {
      console.error("No se encontró el enlace de aprobación. Respuesta de PayPal:", order);
      throw new Error("No se encontró el enlace de aprobación en la respuesta de PayPal.");
    }

    return {
      id: order.id,
      approveUrl: approveLink.href, // URL donde el usuario debe aprobar el pago
    };

  } catch (error) {
    throw new Error(error.response?.data || error.message);
  }
};


const checkoutAprove = async(access_token, data) => {
  try {

    const response = await axios.post(
      `${PAYPAL_SANDBOX_URL}/v2/checkout/orders`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`,
          'Paypal-Request-Id': generateUUID() //GENERATED UUID
        }
      }
    );

    return response.data; // Retorna el access_token correctamente

  } catch (error) {
    throw new Error(error.response?.data || error.message); // Lanza un error en caso de fallo
  }
}

const checkoutSuccess = async (access_token, orderId) => {
  try {
    const response = await axios.post(
      `${PAYPAL_SANDBOX_URL}/v2/checkout/orders/${orderId}/capture`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`,
        }
      }
    );

    return response.data; // Retorna el access_token correctamente

  } catch (error) {
    throw new Error(error.response?.data || error.message); // Lanza un error en caso de fallo
  }
};

const cancelCheckout = (req, res = response) => {
  res.redirect("/");
};

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
  });
}

module.exports = { getAccessToken, checkoutOrder, checkoutSuccess, cancelCheckout, generateUUID };
