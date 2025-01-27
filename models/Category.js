const {Schema, model} = require('mongoose')

const CategorySchema = Schema({
    title: {
        type: String,
        required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
})

CategorySchema.method('toJSON', function(){
    const {_id, __v, ...object} = this.toObject()
    object.id = _id
    return object
  })

module.exports = model('Category', CategorySchema)