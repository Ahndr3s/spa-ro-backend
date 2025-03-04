const { Router } = require("express");
const {
  getAccessToken,
  checkoutOrder,
  checkoutSuccess,
  cancelCheckout,
} = require("../controllers/paymentController");
// const HOST = process.env.HOST;
const API_URL = process.env.API_URL;

const router = Router();
router.post("/", async (req, res) => {
  // getAccessToken()
  // .then(token => console.log("Access Token:", token))
  // .catch(error => console.error("Error obteniendo token:", error.message));
  
  try {
    const access_token = await getAccessToken();

    let order_data_json = {
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: "d9f80740-38f0-11e8-b467-0ed5f89f718b",
          amount: {
            currency_code: "USD",
            value: "100.00",
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: "100.00", // Debe coincidir con la suma de los items
              },
            },
          },
          items: [
            {
              name: "Producto de prueba",
              unit_amount: {
                currency_code: "USD",
                value: "100.00",
              },
              quantity: "1",
            },
          ],
        },
      ],
      application_context: {
        brand_name: "Mi Tienda",
        landing_page: "LOGIN", // Opcional: 'BILLING' para usar dirección de facturación
        user_action: "PAY_NOW", // Para que el botón en PayPal diga "Pagar ahora"
        // return_url: `${HOST}/api/payments/success`,  // URL a la que PayPal redirige al usuario tras el pago
        // cancel_url: `${HOST}/api/payments/cancel`,  // URL si el usuario cancela el pago
        return_url: `${API_URL}/api/payments/success`,  // URL a la que PayPal redirige al usuario tras el pago
        cancel_url: `${API_URL}/api/payments/cancel`,  // URL si el usuario cancela el pago
      },
    };
    console.log("Datos de orden antes de enviar a PayPal:", JSON.stringify(order_data_json, null, 2));

    // const data = JSON.stringify(order_data_json);

    // Crear orden y obtener la URL de aprobación
    // const orderResponse = await checkoutOrder(access_token, data);
    const orderResponse = await checkoutOrder(access_token, order_data_json);

    if (!orderResponse || !orderResponse.id || !orderResponse.approveUrl) {
      throw new Error("Error al crear la orden. Respuesta inválida de PayPal.");
    }

    // Enviar la URL al frontend para redirigir al usuario a PayPal
    res.json({
      orderId: orderResponse.id,
      approveUrl: orderResponse.approveUrl,
    });
  } catch (err) {
    console.error("Error al procesar el pago:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/success", async (req, res) => {
  try {
    const { orderId } = req.body; // PayPal envía el orderId en el cuerpo
    if (!orderId) {
      return res.status(400).json({ error: "Falta el orderId." });
    }

    const access_token = await getAccessToken();
    const captureResponse = await checkoutSuccess(access_token, orderId);

    res.json({
      message: "Pago capturado con éxito",
      capture: captureResponse,
    });

  } catch (err) {
    console.error("Error al capturar la orden:", err);
    res.status(500).json({ error: err.message });
  }
});


router.get("/cancel", (req, res) => {
  res.json({ message: "El pago fue cancelado por el usuario." });
});

module.exports = router;
