const { Schema, model } = require('mongoose')

const PositionSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: false }
)

module.exports = model('Position', PositionSchema)
