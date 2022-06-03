const User = require('../models/user.model')
const ApiError = require('../error/api.error')
const UserDto = require('../dto/user.dto')
const chatService = require('../services/chat.service')

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
}

module.exports = new ChatController()
