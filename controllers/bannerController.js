const { response } = require("express");
const Banner = require("../models/Banner");

const getBanners = async (req, res = response) => {
  const banners = await Banner.find().populate("user", "name");
  return res.json({
    ok: true,
    banners,
  });
};

const createBanner = async(req, res = response) => {
    // const banner = new Banner(req.body)
    const banner = new Banner({
        ...req.body,
        user: req.uuid
    });
    
    
    if(req.file){
        banner.img = req.file.path  
    }
    // console.log(banner)

    try {
        banner.user = req.uuid
        const savedBanner = await banner.save()
        res.json({
            ok: true,
            banner: savedBanner
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Talk with the admin'
        })
    }
}

const updateBanner = async(req, res = response) => {
    const bannerId = req.params.id
    const { user: uuid } = req.body;
    // console.log(req.body)
    // console.log(uuid)

    try {
        const banner = await Banner.findById(bannerId)
        if(!banner){
            return res.status(401).json({
                ok: false,
                msg: 'There is no banner with the given id!!!'
            })
        }

        if(banner.user.toString() !== uuid){
            return res.status(401).jsonp({
                ok: false,
                msg: 'This user cannot update this banner!!!'
            })
        }

        const newBanner = {
            ...req.body,
            user: uuid
        }

        const updatedBanner = await Banner.findByIdAndUpdate(bannerId, newBanner, {new: true})

        res.json({
            ok: true, 
            banner: updatedBanner
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Talk with the Admin'
        })
    }
}

const deleteBanner = async(req, res = response) => {
    const bannerId = req.params.id
    const uuid = req.query.user; 

    try {
        const banner = await Banner.findById(bannerId)
        if(!banner){
            return res.status(404).json({
                ok: false,
                msg: 'There is no banner with the given id!!!'
            })
        }

        if(banner.user.toString() !== uuid){
            return res.status(401).json({
                ok: false,
                msg: 'This user cannot delete this banner'
            })
        }

        await Banner.findByIdAndDelete(bannerId)

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


module.exports = {getBanners, createBanner, updateBanner, deleteBanner }