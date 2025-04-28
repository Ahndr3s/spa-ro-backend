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

// PREPARES A PAYPAL'S PAYMENT REQUEST AND IT'S OBJECT TO BE APPROVED
router.post("/success", async (req, res) => {
  console.log("Recibida petición POST en /api/payments/success");

  try {
    const { orderId } = req.body; // Solo recibimos orderId

    if (!orderId) {
      console.error("Error: Falta el orderId.");
      return res.status(400).json({ error: "Falta el orderId." });
    }

    // Si quieres, podrías consultar el estado de la orden con la API de PayPal aquí
    console.log("Orden completada exitosamente:", orderId);

    // Aquí podrías guardar la orden en tu base de datos si quieres

    return res.json({ message: "Orden registrada correctamente", orderId });
  } catch (err) {
    console.error("Error al capturar la orden:", err);
    return res.status(500).json({ error: "Error al registrar la orden." });
  }
});

// HANDLES A SUCCESFUL PAYPAL'S PAYMENT REQUEST
router.post("/success", async (req, res) => {
  console.log("Recibida petición POST en /api/payments/success");

  try {
    const { orderId, accessToken } = req.body; // Recibir token del frontend

    if (!orderId) {
      console.error("Error: Falta el orderId.");
      return res.status(400).json({ error: "Falta el orderId." });
    }

    if (!accessToken) {
      console.error("Error: Falta el accessToken.");
      return res.status(400).json({ error: "Falta el accessToken." });
    }

    console.log("Usando accessToken existente...");
    const captureResponse = await checkoutSuccess(accessToken, orderId);

    console.log("Pago capturado con éxito:", captureResponse);
    // return res.redirect(`${FRONTEND_URL}/successPage`);
    // En lugar de redirigir, devuelve un JSON con la confirmación
    return res.json({ message: "Pago capturado con éxito" });
  } catch (err) {
    console.error("Error al capturar la orden:", err);
    return res.redirect(
      `${FRONTEND_URL}/successPage?message=Error al capturar la orden.`
    );
  }
});

module.exports = router;
