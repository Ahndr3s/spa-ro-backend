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
router.post("/", async (req, res) => {
  try {
    // Usamos el mismo token para toda la sesión
    const access_token = await getAccessToken();
    
    // Resto del código igual...
    
    res.json({
      orderId: orderResponse.id,
      approveUrl: orderResponse.approveUrl,
      accessToken: access_token, // Enviamos el mismo token al frontend
    });
  } catch (err) {
    // Manejo de errores...
  }
});

// HANDLES A SUCCESFUL PAYPAL'S PAYMENT REQUEST
router.post("/success", async (req, res) => {
  try {
    const { orderId, accessToken } = req.body;
    
    // Validaciones...
    
    // Usamos el mismo token que recibimos del frontend
    const captureResponse = await checkoutSuccess(accessToken, orderId);
    
    res.json({ message: "Pago capturado con éxito" });
  } catch (err) {
    // Manejo de errores...
  }
});

module.exports = router;
