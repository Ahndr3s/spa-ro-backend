const { Schema, model } = require("mongoose");

const BannerSchema = Schema({
  type: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  subtitle1: {
    type: String,
    required: true,
  },
  subtitle2: {
    type: String,
    required: true,
  },
  img: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

BannerSchema.method('toJSON', function(){
    const {_id, __v, ...object} = this.toObject()
    object.id = _id
    return object
  })
  
  module.exports = model("Banner", BannerSchema);