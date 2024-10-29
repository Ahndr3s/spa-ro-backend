const { response } = require("express");
const Sale = require("../models/Sales");

const getSales = async (req, res = response) => {
  const sales = await Sale.find().populate("product", "name");
  return res.json({
    ok: true,
    sales,
  });
};

const createSale = async (req, res = response) => {
  const sale = new Sale(req.body);

  try {
    sale.user = req.uuid;

    // Asegúrate de que price y quantity están definidos y se convierten a número
    const price = parseFloat(req.body.price);
    const quantity = parseInt(req.body.quantity);

    if (isNaN(price) || isNaN(quantity)) {
      return res.status(400).json({
        ok: false,
        msg: "Price and quantity must be valid numbers.",
      });
    }

    // Calcular subTotal, iva y total
    sale.subTotal = (price * quantity).toString(); // Calcula el subtotal
    sale.iva = (parseFloat(sale.subTotal) * 0.16).toString(); // Calcula el IVA (16%)
    sale.total = (parseFloat(sale.subTotal) + parseFloat(sale.iva)).toString(); // Calcula el total


    const savedSale = await sale.save();
    res.json({
      ok: true,
      sale: savedSale
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Talk with the admin",
    });
  }
};

const updateSale = async (req, res = response) => {
  const saleId = req.params.id;
  const uuid = req.uuid;

  try {
    const sale = await Sale.findById(saleId);
    if (!sale) {
      return res.status(401).json({
        ok: false,
        msg: "There is no costume with the given id!!!",
      });
    }

    if (sale.user.toString() !== uuid) {
      return res.status(401).json({
        ok: false,
        msg: "This user cannot update this costume!!!",
      });
    }

    const newSale = {
      ...req.body,
      user: uuid,
    };

    const updateSale = await Sale.findByIdAndUpdate(saleId, newSale, {
      new: true,
    });

    res.json({
      ok: true,
      sale: updateSale,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Talk to the Admin",
    });
  }
};

const deleteSale = async (req, res = response) => {
  const saleId = req.params.id;
  const uuid = req.uuid;

  try {
    const sale = await Sale.findById(saleId);
    if (!sale) {
      return res.status(401).json({
        ok: false,
        msg: "There is no costume with the given id!!!",
      });
    }

    if (sale.user.toString() !== uuid) {
      return res.status(401).json({
        ok: false,
        msg: "This user cannot update this costume!!!",
      });
    }

    await Sale.findByIdAndDelete(saleId);
    res.json({
      ok: true,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
        ok: false,
        msg: 'Talk with the admin'
    })
  }
};

module.exports = {getSales, createSale, updateSale, deleteSale}
