const { Schema, model } = require('mongoose')

const UserSchema = new Schema(
  {
    name: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: { type: String, default: 'user' },
    avatar: { type: String, default: null },
    lastVisit: { type: Date, default: null },
    notificationCount: { type: Number, default: 0 },
    bio: {
      birthday: {
        day: { type: Number },
        month: { type: String },
        year: { type: Number },
      },
      city: { type: String },
      language: { type: String },
      gender: { type: String, required: true },
      familyStatus: { type: String },
    },
    settings: {
      notification: {
        messagesToast: { type: Boolean, default: true },
      },
    },
  },
  { timestamps: true }
)

UserSchema.index({ 'name.firstName': 'text', 'name.lastName': 'text' })

module.exports = model('User', UserSchema)
