const User = require('../models/user.model')
const ApiError = require('../error/api.error')
const UserDto = require('../dto/user.dto')
const chatService = require('../services/chat.service')
const Chat = require('../models/chat.model')

class ChatController {
  async getAll(req, res, next) {
    try {
      const { userId } = req.params
      const chatsToBeSent = await chatService.getAll(userId)

      return res.json(chatsToBeSent)
    } catch (error) {
      return next(ApiError.internal(error))
    }
  }

  async getChatUser(req, res, next) {
    try {
      const { id } = req.params
      const user = await User.findById({ _id: id })

      if (!user) {
        return next(ApiError.badRequest('Пользователь не найден'))
      }
      const userDto = new UserDto(user)

      return res.json({ user: userDto })
    } catch (error) {
      return next(ApiError.internal(error))
    }
  }

  async deleteChat(req, res, next) {
    try {
      const { userId } = req.body
      const { messagesWith } = req.params

      await chatService.deleteChat(userId, messagesWith, next)

      return res.status(200).send('Чат удалён')
    } catch (error) {
      return next(ApiError.internal(error))
    }
  }

  async setMessageUnread(req, res) {
    const { withId } = req.params
    const { id } = req.body
    const user = await Chat.findOne({ user: withId }).populate('chats.messagesWith')
    const chatTo = user.chats.find((chat) => chat.messagesWith._id.toString() === id)

    chatTo.countUnreadMessages += 1
    user.save()
  }

  async messagesRead(req, res) {
    const { withId } = req.params
    const { id } = req.body
    const user = await Chat.findOne({ user: withId }).populate('chats.messagesWith')
    const chatTo = user.chats.find((chat) => chat.messagesWith._id.toString() === id)
    chatTo.unreadMessages = []
    chatTo.countUnreadMessages = 0
    await user.save()
  }
}

module.exports = new ChatController()
