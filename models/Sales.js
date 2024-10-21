const { Schema, model } = require("mongoose");

const SalesSchema = Schema({
  saleDate: {
    type: String,
    required: true,
  },
  clientName: {
    type: String,
    required: true,
  },
  clientEmail: {
    type: String,
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Costume",
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  quantity: {
    type: String,
    required: true,
  },
  subTotal: {
    type: String,
    required: true,
  },
  iva: {
    type: String,
    required: true,
  },
  total: {
    type: String,
    required: true,
  },
  discounts: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

SalesSchema.method('toJSON', function(){
    const {_id, __v, ...object} = this.toObject()
    object.id = _id
    return object
  })
  
  module.exports = model("Sale", SalesSchema);