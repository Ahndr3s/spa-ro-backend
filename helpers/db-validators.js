const { response } = require("express");
// const Category = require("../models/categorie");
// const Role = require("../models/role");
const user = require("../models/User");
const { Product } = require("../models");


// const validateRole = async (role = "") => {
//   const RoleExists = await Role.findOne({ role });
//   if (!RoleExists) throw new Error("The role specified does not exists!!!");
// };

// VERIFY IF email EXISTS
const validateEmail = async (email = "") => {
  const emailExists = await user.findOne({ email });
  if (emailExists) throw new Error("That email is registed already!!!");
    // return res.status(400).json({ msg: "That emai is registed already!!!" });
};

// VERIFY IF USERS id EXISTS 
const validateId = async (id = "") => {
  const idExists = await user.findById( id );
  if (!idExists) throw new Error("The provided user id does not exists!!!");
};


// VERIFIY IF CATEGORYS id EXISTS
// const categoryExists = async (id = "") => {
//   // const idExists = await Category.findById( id );
//   const category = await Category.findById( id );
//   if (!category || !category.status) throw new Error("The provided category id does not exists!!!");
// };


// VERIFIY IF PRODUCTS id EXISTS
const productExists = async (id = "") => {
  // const idExists = await Category.findById( id );
  const product = await Product.findById( id );
  if (!product || !product.status ) throw new Error("The provided product id does not exists!!!");
};

// VERIFIY IF PRODUCTS id EXISTS
const productIsAvailable = async (id = "") => {
  // const idExists = await Category.findById( id );
  const product = await Product.findById( id );
  if (!product.available ) throw new Error("Currently we do not have stock of this product!!!");
};

// VERIFY ALLOWED COLLECTIONS
const allowedCollections = (collection = '', collections = []) => {
  const allowed = collections.includes(collection)
  if(!allowed){
    throw new Error(`The collection ${collection} is not allowed!!!`)
  }
  return true
}

module.exports = { validateEmail, validateId, productExists, productIsAvailable, allowedCollections };
