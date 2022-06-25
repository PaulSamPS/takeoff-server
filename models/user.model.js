const { Schema, model } = require('mongoose')

const UserSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    position: { type: String, required: true },
    level: { type: String, required: true },
    role: { type: String, default: 'user' },
    avatar: { type: String, default: null },
      notification: {type: Boolean, default: false}

  },
  { timestamps: true }
)

module.exports = model('User', UserSchema)
