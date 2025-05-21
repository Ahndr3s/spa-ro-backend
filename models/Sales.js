const { Schema, model } = require("mongoose");

const SalesSchema = Schema({
    type: {
    type: Number,
    required: true,
  },
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
  sellingProducts: {
    type: Object,
    required: true,
  },
  contactAddress: {
    type: String,
    required: true,
  },
  subTotal: {
    type: String,
    required: true,
  },
    regTariff: {
    type: Number,
    required: true,
  },
  iva: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  discounts: {
    type: String,
  },
  // user: {
  //   type: Schema.Types.ObjectId,
  //   ref: "User",
  //   required: true,
  // },
});

SalesSchema.method('toJSON', function(){
    const {_id, __v, ...object} = this.toObject()
    object.id = _id
    return object
  })
  
  module.exports = model("Sale", SalesSchema);