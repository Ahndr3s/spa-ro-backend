const { response } = require("express");
const Sale = require("../models/Sales");

// GETS ALL RECOPRDS OF SALES
const getSales = async (req, res = response) => {
  // const sales = await Sale.find().populate("user", "name");
  const sales = await Sale.find();
  return res.json({
    ok: true,
    sales,
  });
};

// CREATES A NEW RECORD OF SALE
const createSale = async (req, res = response) => {
  const sale = new Sale(req.body);
  try {
    sale.user = req.uuid;

    // Calcular subTotal, iva y total
    sale.iva = parseFloat(sale.subTotal * 0.16); // Calcula el IVA (16%)
    sale.total =
      parseFloat(sale.subTotal) +
      parseFloat(sale.iva) +
      parseFloat(sale.regTariff); // Calcula el total

    // console.log(sale)
    const savedSale = await sale.save();
    res.json({
      ok: true,
      sale: savedSale,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Talk with the admin",
    });
  }
};

// UPDATES A SALE RECORD
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

// DELETES A SALE RECORD
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
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Talk with the admin",
    });
  }
};

// GETS THE MOST SOLD PRODUCT ON THE COLLECTION
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
};

// GETS THE MOST SOLD PRODUCT OF THE MONTH
const getMostSoldProductOfTheMonth = async (req, res) => {
  try {
    const stats = await Sale.getMostSoldProductOfTheMonth(req.inputDate);
    res.json(stats);
  } catch (error) {
    console.error("Error at getting month's statistics:", error);
    res.status(500).json({ message: "Error at getting month's statistics" });
  }
};

module.exports = {
  getSales,
  createSale,
  updateSale,
  deleteSale,
  getMostSoldProduct,
  getMostSoldProductOfTheMonth,
};
