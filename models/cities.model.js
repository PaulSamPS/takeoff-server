const { Schema, model } = require('mongoose')

const CitiesSchema = new Schema(
  {
    region: { type: String, required: true },
    city: { type: String, required: true },
  },
  { timestamps: false }
)

module.exports = model('Cities', CitiesSchema)
