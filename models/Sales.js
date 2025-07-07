const { Schema, model, default: mongoose } = require("mongoose");

const SalesSchema = Schema({
  type: {
    type: Number,
    required: true,
  },
  saleDate: {
    type: Date,
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
  return this.aggregate([
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

// METHOD TO GET THE EARNINGS OF THE MONTH
SalesSchema.statics.getMostSoldProductOfTheMonth = async function (dateInput) {
  // Convertir string "yyyy/mm/dd" a objeto Date
  const [year, month,day] = dateInput.split("-").map(Number);
  const inputDate = new Date(year, month - 1, day);

  const targetMonth = inputDate.getMonth() + 1; // 1-12
  const targetYear = inputDate.getFullYear();   // 4 dígitos

  return this.aggregate([
    // 1. Filtrar ventas por mes y año usando campos Date
    {
      $match: {
        $expr: {
          $and: [
            { $eq: [{ $month: "$saleDate" }, targetMonth] },
            { $eq: [{ $year: "$saleDate" }, targetYear] }
          ]
        }
      }
    },

    // 2. Descomponer el arreglo de productos vendidos
    { $unwind: "$sellingProducts" },

    // 3. Agrupar por ID del producto, contar y conservar info
    {
      $group: {
        _id: "$sellingProducts.id",
        count: { $sum: 1 },
        product: { $first: "$sellingProducts" }
      }
    },

    // 4. Ordenar por mayor cantidad
    { $sort: { count: -1 } },

    // 5. Limitar al top 1
    { $limit: 1 },

    // 6. Reestructurar salida
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: ["$product", { count: "$count" }]
        }
      }
    }
  ]);
};

// METHOD TO GET THE MOST SOLD PRODUCT
SalesSchema.statics.getSalesOfTheMonth = async function () {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  return this.find({
    saleDate: {
      $gte: startOfMonth,
      $lt: startOfNextMonth
    }
  });
};


module.exports = model("Sale", SalesSchema);
