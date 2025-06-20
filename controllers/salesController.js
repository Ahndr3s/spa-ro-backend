const { response } = require("express");
const Sale = require("../models/Sales");

const getSales = async (req, res = response) => {
  // const sales = await Sale.find().populate("user", "name");
  const sales = await Sale.find();
  return res.json({
    ok: true,
    sales,
  });
};

const createSale = async (req, res = response) => {
  const sale = new Sale(req.body);
  try {
    sale.user = req.uuid;

    // Calcular subTotal, iva y total
    sale.iva = parseFloat(sale.subTotal * 0.16); // Calcula el IVA (16%)
    sale.total = (parseFloat(sale.subTotal) + parseFloat(sale.iva) + parseFloat(sale.regTariff)); // Calcula el total

    // console.log(sale)
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

const getMostSoldProduct = async (req, res) => {
  // Inefficient query
  // console.log('llegue al backend con el '+req.user._id)
  try {
    const stats = await Sale.getMostSoldProduct();
    res.json(stats);
  } catch (error) {
    console.error("Error at getting statistics:", error);
    res.status(500).json({ message: "Error at getting statistics" });
  }
}

module.exports = {getSales, createSale, updateSale, deleteSale, getMostSoldProduct}
