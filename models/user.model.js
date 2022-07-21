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
    notification: { type: Boolean, default: false },
    lastVisit: { type: Date, default: null },
    isOnline: { type: Boolean, default: false },
    bio: [
      {
        birthday: { type: Date, require: true },
        city: { type: String, required: true },
        language: { type: String, required: true },
        gender: { type: String, required: true },
        familyStatus: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
)

module.exports = model('User', UserSchema)
