const { Schema, model } = require('mongoose')

const LevelSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: false }
)

module.exports = model('Level', LevelSchema)
