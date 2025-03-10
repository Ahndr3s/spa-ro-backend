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
    const access_token = await getAccessToken(); // Generamos el token solo una vez

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
                value: "100.00",
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
        landing_page: "LOGIN",
        user_action: "PAY_NOW",
        return_url: `${FRONTEND_URL}/successPage`,
        cancel_url: `${FRONTEND_URL}/home`,
      },
    };

    console.log("🛒 Creando orden en PayPal...");
    const orderResponse = await checkoutOrder(access_token, order_data_json);

    if (!orderResponse || !orderResponse.id || !orderResponse.approveUrl) {
      throw new Error("❌ Error al crear la orden en PayPal.");
    }

    // Enviar orderId, approveUrl y access_token al frontend
    res.json({
      orderId: orderResponse.id,
      approveUrl: orderResponse.approveUrl,
      accessToken: access_token, // Pasamos el token al frontend
    });
  } catch (err) {
    console.error("❌ Error en la creación de la orden:", err);
    res.status(500).json({ error: err.message });
  }
});

// HANDLES A SUCCESFUL PAYPAL'S PAYMENT REQUEST
router.post("/success", async (req, res) => {
  console.log("📢 Recibida petición POST en /api/payments/success");

  try {
    const { orderId, accessToken } = req.body; // Recibir token del frontend

    if (!orderId) {
      console.error("❌ Error: Falta el orderId.");
      return res.status(400).json({ error: "Falta el orderId." });
    }

    if (!accessToken) {
      console.error("❌ Error: Falta el accessToken.");
      return res.status(400).json({ error: "Falta el accessToken." });
    }

    console.log("🔑 Usando accessToken existente...");
    const captureResponse = await checkoutSuccess(accessToken, orderId);

    console.log("✅ Pago capturado con éxito:", captureResponse);
    return res.redirect(`${FRONTEND_URL}/successPage`);
  } catch (err) {
    console.error("❌ Error al capturar la orden:", err);
    return res.redirect(`${FRONTEND_URL}/successPage?message=Error al capturar la orden.`);
  }
});



module.exports = router;
