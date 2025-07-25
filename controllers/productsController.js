const { response } = require("express");
const Product = require("../models/Product");

const getProducts = async (req, res = response) => {
  const products = await Product.find().populate("user", "name");
  return res.json({
    ok: true,
    products,
  });
};

const createProduct = async (req, res = response) => {
  try {
    const { user: uuid } = req.body;

    if (!uuid) {
      return res.status(400).json({
        ok: false,
        msg: "User UUID is required",
      });
    }

    const product = new Product({ ...req.body, user: uuid });

    if (req.file) {
      product.img = req.file.path;
    }
    // console.log(product)
    const savedProduct = await product.save();
    res.json({
      ok: true,
      product: savedProduct,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Server Error Talk with the admin",
    });
  }
};

const updateProduct = async (req, res = response) => {
  const productId = req.params.id;
  const { user: uuid } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(401).json({
        ok: false,
        msg: "There is no product with the given id!!!",
      });
    }

    if (product.user.toString() !== uuid) {
      return res.status(401).jsonp({
        ok: false,
        msg: "This user cannot update this product!!!",
      });
    }

    const newProduct = {
      ...req.body,
      user: uuid,
    };

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      newProduct,
      { new: true }
    );

    res.json({
      ok: true,
      product: updatedProduct,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Talk with the Admin",
    });
  }
};

const deleteProduct = async (req, res = response) => {
  const productId = req.params.id;
  const uuid = req.query.user;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        ok: false,
        msg: "There is no product with the given id!!!",
      });
    }

    if (product.user.toString() !== uuid) {
      return res.status(401).json({
        ok: false,
        msg: "This user cannot delete this product",
      });
    }

    await Product.findByIdAndDelete(productId);

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

module.exports = { getProducts, createProduct, updateProduct, deleteProduct };
