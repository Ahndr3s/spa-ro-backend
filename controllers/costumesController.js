const { response } = require("express");
const Costume = require("../models/Costumes");

const getCostumes = async (req, res = response) => {
  const costumes = await Costume.find().populate("user", "name");
  return res.json({
    ok: true,
    costumes,
  });
};

const createCostume = async(req, res = response) => {
    const costume = new Costume(req.body)
    
    if(req.file){
        costume.img = req.file.path
    }

    try {
        costume.user = req.uuid
        const savedCostume = await costume.save()
        res.json({
            ok: true,
            costume: savedCostume
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Talk with the admin'
        })
    }
}

const updateCostume = async(req, res = response) => {
    const costumeId = req.params.id
    const uuid = req.uuid

    try {
        const costume = await Costume.findById(costumeId)
        if(!costume){
            return res.status(401).json({
                ok: false,
                msg: 'There is no costume with the given id!!!'
            })
        }

        if(costume.user.toString() !== uuid){
            return res.status(401).jsonp({
                ok: false,
                msg: 'This user cannot update this costume!!!'
            })
        }

        const newCostume = {
            ...req.body,
            user: uuid
        }

        const updatedCostume = await Costume.findByIdAndUpdate(costumeId, newCostume, {new: true})

        res.json({
            ok: true, 
            costume: updatedCostume
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Talk with the Admin'
        })
    }
}

const deleteCostume = async(req, res = response) => {
    const costumeId = req.params.id
    const uuid = req.uuid 

    try {
        const costume = await Costume.findById(costumeId)
        if(!costume){
            return res.status(404).json({
                ok: false,
                msg: 'There is no costume with the given id!!!'
            })
        }

        if(costume.user.toString() !== uuid){
            return res.status(401).json({
                ok: false,
                msg: 'This user cannot delete this costume'
            })
        }

        await Costume.findByIdAndDelete(costumeId)

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


module.exports = {getCostumes, createCostume, updateCostume, deleteCostume}