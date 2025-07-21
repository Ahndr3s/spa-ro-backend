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
    console.log("Iniciando creación de orden...");
    const access_token = await getAccessToken();
    console.log("Token de acceso obtenido:", access_token ? "OK" : "Fallo");
    
    const { order } = req.body;
    console.log(order)
    if (
      !order ||
      !order.sellingProducts ||
      order.sellingProducts.length === 0
    ) {
      return res.status(400).json({ error: "Orden inválida o sin productos" });
    }
    
    const shipmentinfo = order.contactAddress.split(' ');
    // Validar que el subtotal coincida con la suma de los productos
    const calculatedSubtotal = order.sellingProducts.reduce((sum, product) => {
      return sum + parseFloat(product.price) * parseInt(product.qty);
    }, 0);

    if (Math.abs(calculatedSubtotal - order.subTotal) > 0.01) {
      return res.status(400).json({
        error: "El subtotal no coincide con la suma de los productos",
      });
    }

    // Validaciones adicionales...
    // console.log("Datos de la orden recibida:", JSON.stringify(order, null, 2));

    const order_data_json = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "MXN", // Moneda cambiada a pesos mexicanos
            value: (
              parseFloat(order.subTotal) +
              parseFloat(order.regTariff) +
              parseFloat(order.Iva)
            ).toFixed(2),
            breakdown: {
              item_total: {
                currency_code: "MXN",
                value: parseFloat(order.subTotal).toFixed(2),
              },
              shipping: {
                currency_code: "MXN",
                value: parseFloat(order.regTariff).toFixed(2),
              },
              tax_total: {
                currency_code: "MXN",
                value: parseFloat(order.Iva).toFixed(2),
              },
            },
          },
          items: order.sellingProducts.map((product) => ({
            name: product.title.substring(0, 127), // PayPal limita a 127 caracteres
            description:
              product.description?.substring(0, 127) ||
              "Producto sin descripción",
            unit_amount: {
              currency_code: "MXN",
              value: parseFloat(product.price).toFixed(2),
            },
            quantity: product.qty.toString(),
            sku: product.id?.toString() || "N/A",
          })),
          shipping: {
            address: {
              address_line_1: shipmentinfo[0],
              // address_line_2: order.shippingAddress.interior || "", // Opcional
              admin_area_1: shipmentinfo[3], // Estado (ej. "CDMX", "Jalisco")
              admin_area_2: shipmentinfo[2], // Ciudad/Municipio
              postal_code: shipmentinfo[1], // Código Postal
              country_code: "MX", // Código de país para México
            },
          },
        },
      ],
      application_context: {
        brand_name: "Mi Tienda",
        landing_page: "LOGIN",
        user_action: "PAY_NOW",
        return_url: `${FRONTEND_URL}/successPage`,
        cancel_url: `${FRONTEND_URL}/home`,
        shipping_preference: "SET_PROVIDED_ADDRESS", // Indica que proveerás la dirección
      },
    };

    console.log("Enviando orden a PayPal...");
    const orderResponse = await checkoutOrder(access_token, order_data_json);

    if (!orderResponse.id) {
      throw new Error("PayPal no devolvió un ID de orden válido");
    }

    console.log("Orden creada con ID:", orderResponse.id);
    res.json({
      succeess: true,
      orderId: orderResponse.id,
      accessToken: access_token, // Enviar el mismo token
    });
  } catch (err) {
    console.error("Error en la creación de la orden:", err);
    res.status(500).json({
      succeess: false,
      error: err.message,
      details: err.response?.data || null,
    });
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
