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
  unreadMessage: [
      {
          sender: {type: Schema.Types.ObjectId, ref: 'User', required: true},
          receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
          message: {type: String, required: true},
          date: {type: Date}
      }
  ],
    countUnreadMessages: { type: Number, default: 0 },
    lastVisit: { type: Date, default: null },
    isOnline: { type: Boolean, default: false },
  },
  { timestamps: true }
)

module.exports = model('User', UserSchema)
