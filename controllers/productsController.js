const { response } = require("express");
const Product = require("../models/Product");
const  mongoose  = require("mongoose");

const getProducts = async (req, res = response) => {
  const products = await Product.find().populate("user", "name");
  return res.json({
    ok: true,
    products,
  });
};

const createProduct = async(req, res = response) => {
    const product = new Product(req.body)
    
    if(req.file){
        product.img = req.file.path
    }
    product.category = new mongoose.Types.ObjectId(category)

    try {
        product.user = req.uuid
        const savedProduct = await product.save()
        res.json({
            ok: true,
            product: savedProduct
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Talk with the admin'
        })
    }
}

const updateProduct = async(req, res = response) => {
    const productId = req.params.id
    const uuid = req.uuid

    try {
        const product = await Product.findById(productId)
        if(!product){
            return res.status(401).json({
                ok: false,
                msg: 'There is no product with the given id!!!'
            })
        }

        if(product.user.toString() !== uuid){
            return res.status(401).jsonp({
                ok: false,
                msg: 'This user cannot update this product!!!'
            })
        }

        const newProduct = {
            ...req.body,
            user: uuid
        }

        const updatedProduct = await Product.findByIdAndUpdate(productId, newProduct, {new: true})

        res.json({
            ok: true, 
            product: updatedProduct
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Talk with the Admin'
        })
    }
}

const createOrUpdateProduct = async (req, res) => {
    try {
      let { category } = req.body;
  
      // Convertir category a ObjectId en el backend
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({ message: "Categoría inválida" });
      }
  
      category = mongoose.Types.ObjectId.createFromHexString(category);

    const newProduct = new Product({
      ...req.body,
      category, // Se guarda como ObjectId
    });
      const product = await Product.findByIdAndUpdate(req.body.id, newProduct, {
        new: true,
        upsert: true,
      });
  
      res.status(200).json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  };

const deleteProduct = async(req, res = response) => {
    const productId = req.params.id
    const uuid = req.uuid 

    try {
        const product = await Product.findById(productId)
        if(!product){
            return res.status(404).json({
                ok: false,
                msg: 'There is no product with the given id!!!'
            })
        }

        if(product.user.toString() !== uuid){
            return res.status(401).json({
                ok: false,
                msg: 'This user cannot delete this product'
            })
        }

        await Product.findByIdAndDelete(productId)

        res.json({
            ok: true
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Talk with the admin'
        })
    }
}


module.exports = {getProducts, createProduct, updateProduct, createOrUpdateProduct, deleteProduct}