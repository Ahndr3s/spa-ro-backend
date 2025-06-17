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

SalesSchema.method("toJSON", function () {
  const { _id, __v, ...object } = this.toObject();
  object.id = _id;
  return object;
});

// METHOD TO GET THE MOST SOLD PRODUCT
SalesSchema.statics.getMostSoldProduct = async function () {
  return db.ventas.aggregate([
    { $unwind: "$sellingProducts" },
    {
      $group: {
        _id: "$sellingProducts.id",
        title: { $first: "$sellingProducts.title" },
        totalQtySold: { $sum: "$sellingProducts.qty" },
      },
    },
    { $sort: { totalQtySold: -1 } },
    { $limit: 1 },
    {
      $project: {
        _id: 0,
        id: "$_id",
        name: "$title",
        totalQtySold: 1,
      },
    },
  ]);
};

// METHOD TO GET THE MONTH'S MOST SOLD PRODUCT
// METHOD TO GET THE REGION WITH MOST PRODUCT SHIPMENTS

module.exports = model("Sale", SalesSchema);
