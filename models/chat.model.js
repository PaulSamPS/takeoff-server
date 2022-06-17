const { Schema, model } = require('mongoose')

const ChatSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },

  chats: [
    {
      messagesWith: { type: Schema.Types.ObjectId, ref: 'User' },
      lastView: { type: Date },
      countUnreadMessages: { type: Number, default: 0 },
      unreadMessages: [
        {
          message: { type: String, required: true },
          sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
          receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
          date: { type: Date },
        },
      ],
      messages: [
        {
          message: { type: String, required: true },
          sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
          receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
          date: { type: Date },
        },
      ],
    },
  ],
})

module.exports = model('Chat', ChatSchema)
