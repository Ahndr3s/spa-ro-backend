const { Router } = require("express");
const {
  getAccessToken,
  checkoutOrder,
  checkoutSuccess,
  cancelCheckout,
} = require("../controllers/paymentController");
const API_URL = process.env.API_URL;
const FRONTEND_URL = process.env.FRONTEND_URL;

const router = Router();

// SETS THE PAYPAL REQUEST TO PAYMENT AND PASSES TO OUR CONTROLLER
router.post("/", async (req, res) => {
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
        return_url: `${FRONTEND_URL}/successPage`,  // URL a la que PayPal redirige al usuario tras el pago
        cancel_url: `${FRONTEND_URL}/home`,  // URL si el usuario cancela el pago
      },
    };
    console.log("Datos de orden antes de enviar a PayPal:", JSON.stringify(order_data_json, null, 2));

    // Crear orden y obtener la URL de aprobación
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

// HANDLES A SUCCESFUL PAYPAL'S PAYMENT REQUEST
router.post("/success", async (req, res) => {
  console.log("📢 Recibida petición POST en /api/payments/success");

  try {
    const { orderId } = req.body;
    if (!orderId) {
      console.error("❌ Error: Falta el orderId en la petición.");
      return res.redirect(`${FRONTEND_URL}/successPage?message=Falta el orderId.`);
    }

    const access_token = await getAccessToken();
    const captureResponse = await checkoutSuccess(access_token, orderId);

    console.log("✅ Pago capturado con éxito:", captureResponse);

    // Redirigir al frontend
    return res.redirect(`${FRONTEND_URL}/successPage`);
  } catch (err) {
    console.error("❌ Error al capturar la orden:", err);

    // Solo una respuesta (evita el error ERR_HTTP_HEADERS_SENT)
    return res.redirect(`${FRONTEND_URL}/successPage?message=Error al capturar la orden.`);
  }
});


module.exports = router;
