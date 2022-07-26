const { Schema, model } = require('mongoose')

const UserSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: { type: String, default: 'user' },
    avatar: { type: String, default: null },
    notifications: [
      {
        type: {
          type: String,
          enum: ['newLike', 'newComment', 'newFollower'],
        },
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        post: { type: Schema.Types.ObjectId, ref: 'Post' },
        commentId: { type: String },
        text: { type: String },
        date: { type: Date, default: Date.now },
      },
    ],
    lastVisit: { type: Date, default: null },
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
  },
  { timestamps: true }
)

module.exports = model('User', UserSchema)
