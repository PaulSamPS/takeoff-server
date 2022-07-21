const { Schema, model } = require('mongoose')

const UserSchema = new Schema(
  {
    firstName: { type: String, required: true, unique: true },
    lastName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: { type: String, default: 'user' },
    avatar: { type: String, default: null },
    notification: { type: Boolean, default: false },
    lastVisit: { type: Date, default: null },
    bio: {
      birthday: { type: String, require: true },
      city: { type: String, required: true },
      language: { type: String, required: true },
      gender: { type: String, required: true },
      familyStatus: { type: String },
    },
  },
  { timestamps: true }
)

module.exports = model('User', UserSchema)
