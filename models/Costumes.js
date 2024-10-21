const { Schema, model } = require("mongoose");

const CostumeSchema = Schema({
  type: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  info: {
    type: String,
    required: true,
  },
  stock: {
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

CostumeSchema.method('toJSON', function(){
    const {_id, __v, ...object} = this.toObject()
    object.id = _id
    return object
  })
  
  module.exports = model("Costume", CostumeSchema);