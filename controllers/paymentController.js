const  axios  = require("axios");
const { response } = require("express");
const PAYPAL_API_CLIENT = process.env.PAYPAL_API_CLIENT;
const PAYPAL_API_SECRET = process.env.PAYPAL_API_SECRET;
const PAYPAL_SANDBOX_URL = process.env.PAYPAL_SANDBOX_URL;
let cachedAccessToken = null;
let tokenExpiration = null;

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
  });
}

const getAccessToken = async () => {
  try {
    // Si tenemos un token válido en caché, lo devolvemos
    if (cachedAccessToken && tokenExpiration && tokenExpiration > Date.now()) {
      console.log("Usando token de acceso en caché");
      return cachedAccessToken;
    }

    console.log("Solicitando nuevo Access Token...");
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");

    const response = await axios.post(
      `${PAYPAL_SANDBOX_URL}/v1/oauth2/token`,
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(`${PAYPAL_API_CLIENT}:${PAYPAL_API_SECRET}`).toString("base64")}`,
        },
      }
    );
    
    cachedAccessToken = response.data.access_token;
    // Establecemos la expiración (normalmente 8 horas, pero usamos 7 para estar seguros)
    tokenExpiration = Date.now() + 7 * 60 * 60 * 1000;

    if (!cachedAccessToken) {
      throw new Error("No se recibió un token de acceso válido de PayPal");
    }

    console.log("Nuevo Access Token recibido:", cachedAccessToken);
    return cachedAccessToken;
  } catch (error) {
    console.error("Error en la autenticación con PayPal");
    throw new Error(error.response?.data?.error_description || "Error desconocido al obtener el token");
  }
};

// EXECUTES THE PAYPAL REQUEST TO CHECKOUT AN ORDER
const checkoutOrder = async (access_token, data) => {
  try {
    console.log("Enviando orden a PayPal:", JSON.stringify(data, null, 2)); // Depurar

    const response = await axios.post(
      `${PAYPAL_SANDBOX_URL}/v2/checkout/orders`,
      data, // No usar JSON.stringify aquí
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${access_token}`,
          "Paypal-Request-Id": generateUUID(), // Evita duplicados
        },
      }
    );

    console.log("Respuesta de PayPal:", response.data); // Depurar

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
    console.error("Error en checkoutOrder:", error.response?.data || error.message);
    throw new Error(error.response?.data || error.message);
  }
};

// EXECUTES THE PAYPAL REQUEST TO CAPTURE THE PAYCHECK
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


module.exports = { getAccessToken, checkoutOrder, checkoutSuccess, cancelCheckout, generateUUID };
