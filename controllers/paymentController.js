const  axios  = require("axios");
const { response } = require("express");
const PAYPAL_API_CLIENT = process.env.PAYPAL_API_CLIENT;
const PAYPAL_API_SECRET = process.env.PAYPAL_API_SECRET;
const PAYPAL_SANDBOX_URL = process.env.PAYPAL_SANDBOX_URL;

const getAccessToken = async () => {
  try {
    console.log("Solicitando Access Token...");
    console.log("PAYPAL_API_CLIENT:", PAYPAL_API_CLIENT);
    console.log("PAYPAL_API_SECRET:", PAYPAL_API_SECRET ? "OK" : "NO DEFINIDO");
    console.log("PAYPAL_SANDBOX_URL:", PAYPAL_SANDBOX_URL);

    if (!PAYPAL_API_CLIENT || !PAYPAL_API_SECRET || !PAYPAL_SANDBOX_URL) {
      throw new Error("Faltan credenciales de PayPal en el archivo .env");
    }

    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");

    // const response = await axios.post(
    //   `${PAYPAL_SANDBOX_URL}/v1/oauth2/token`,
    //   params,
    //   {
    //     auth: {
    //       username: PAYPAL_API_CLIENT,
    //       password: PAYPAL_API_SECRET,
    //     },
    //     headers: {
    //       "Content-Type": "application/x-www-form-urlencoded",
    //     },
    //   }
    // );
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
    
    const accessToken = response.data.access_token;

    if (!accessToken) {
      throw new Error("❌ No se recibió un token de acceso válido de PayPal.");
    }

    console.log("✅ Access Token recibido:", accessToken);
    return accessToken;
  } catch (error) {
    console.error("🚨 Error en la autenticación con PayPal 🚨");
    console.error("Código de estado:", error.response?.status);
    console.error("Datos de respuesta:", error.response?.data);

    throw new Error(error.response?.data?.error_description || "Error desconocido al obtener el token");
  }
};

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
