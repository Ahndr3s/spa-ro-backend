const { response } = require("express");
const Category = require("../models/Category");

const getCategories = async (req, res = response) => {
  const categories = await Category.find().populate("user", "name");
  return res.json({
    ok: true,
    categories,
  });
};

const createCategory = async (req, res = response) => {
  try {
    const { user: uuid } = req.body;
    
    if (!uuid) {
      return res.status(400).json({
        ok: false,
        msg: "User UUID is required",
      });
    }

    const category = new Category({ ...req.body, user: uuid });

    if (req.file) {
      category.img = req.file.path;
    }
    const savedCategory = await category.save();
    res.json({
      ok: true,
      category: savedCategory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Server Error Talk with the admin",
    });
  }
};

const updateCategory = async (req, res = response) => {
  const categoryId = req.params.id;
  const { user: uuid } = req.body;

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(401).json({
        ok: false,
        msg: "There is no category with the given id!!!",
      });
    }

    if (category.user.toString() !== uuid) {
      return res.status(401).jsonp({
        ok: false,
        msg: "This user cannot update this category!!!",
      });
    }

    const newCategory = {
      ...req.body,
      user: uuid,
    };

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      newCategory,
      { new: true }
    );

    res.json({
      ok: true,
      category: updatedCategory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Talk with the Admin",
    });
  }
};

const deleteCategory = async (req, res = response) => {
  const categoryId = req.params.id;
  const uuid = req.query.user;

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        ok: false,
        msg: "There is no category with the given id!!!",
      });
    }

    if (category.user.toString() !== uuid) {
      return res.status(401).json({
        ok: false,
        msg: "This user cannot delete this category",
      });
    }

    await Category.findByIdAndDelete(categoryId);

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

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
