const { response } = require("express");
const Category = require("../models/Category");

const getCategories = async (req, res = response) => {
  const categories = await Category.find().populate("user", "name");
  return res.json({
    ok: true,
    categories,
  });
};

const createCategory = async(req, res = response) => {
    const category = new Category(req.body)
    
    if(req.file){
        category.img = req.file.path
    }

    try {
        category.user = req.uuid
        const savedCategory = await category.save()
        res.json({
            ok: true,
            category: savedCategory
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Talk with the admin'
        })
    }
}

const updateCategory = async(req, res = response) => {
    const categoryId = req.params.id
    const uuid = req.uuid

    try {
        const category = await Category.findById(categoryId)
        if(!category){
            return res.status(401).json({
                ok: false,
                msg: 'There is no category with the given id!!!'
            })
        }

        if(category.user.toString() !== uuid){
            return res.status(401).jsonp({
                ok: false,
                msg: 'This user cannot update this category!!!'
            })
        }

        const newCategory = {
            ...req.body,
            user: uuid
        }

        const updatedCategory = await Category.findByIdAndUpdate(categoryId, newCategory, {new: true})

        res.json({
            ok: true, 
            category: updatedCategory
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Talk with the Admin'
        })
    }
}

const deleteCategory = async(req, res = response) => {
    const categoryId = req.params.id
    const uuid = req.uuid 

    try {
        const category = await Category.findById(categoryId)
        if(!category){
            return res.status(404).json({
                ok: false,
                msg: 'There is no category with the given id!!!'
            })
        }

        if(category.user.toString() !== uuid){
            return res.status(401).json({
                ok: false,
                msg: 'This user cannot delete this category'
            })
        }

        await Category.findByIdAndDelete(categoryId)

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


module.exports = {getCategories, createCategory, updateCategory, deleteCategory}