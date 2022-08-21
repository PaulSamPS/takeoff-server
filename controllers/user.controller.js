const User = require('../models/user.model')
const Token = require('../models/token.model')
const Notification = require('../models/notification.model')
const userService = require('../services/user.service')
const ApiError = require('../error/api.error')
const UserDto = require('../dto/user.dto')
const path = require('path')
const fs = require('fs')

class UserController {
  async getAll(req, res) {
    const { search } = req.body
    const user = search ? await User.find({ $text: { $search: search } }) : await User.find()
    const userDto = user.map((u) => new UserDto(u))
    return res.json(userDto)
  }

  async getUsersSearch(req, res) {
    const { name } = req.body
    const users = await User.find({ $text: { $search: name } })
    const userDto = users.map((u) => new UserDto(u))
    return res.json(userDto)
  }

  async getOne(req, res, next) {
    const { id } = req.params
    const user = await User.findById(id)
    if (!user) {
      return next(ApiError.badRequest('Пользователь не найден'))
    }
    return res.json(user)
  }

  async uploadAvatar(req, res) {
    const { id } = req.params
    const { avatar } = req.files
    const user = await userService.uploadAvatar(id, avatar)
    return res.json(user)
  }

  async removeAvatar(req, res, next) {
    try {
      const { id, avatar } = req.params
      const user = await User.findById(id)
      if (!user) {
        return next(ApiError.badRequest('Пользователь не найден'))
      }
      fs.unlink(path.resolve(__dirname, '..', 'static/avatar', avatar), function (err) {
        if (err) throw err
        console.log('Файл Удалён')
      })
      user.avatar = null
      await user.save()
      const userDto = new UserDto(user)
      return res.json({ user: userDto })
    } catch (e) {
      return next(ApiError.internal(e))
    }
  }

  async removeUser(req, res) {
    const { id, avatar } = req.params
    const userAvatar = await User.findOne({ avatar: avatar })
    if (userAvatar) {
      fs.unlink(path.resolve(__dirname, '..', 'static/avatar', avatar), function (err) {
        if (err) throw err
        console.log('Файл Удалён')
      })
    }
    const userName = await User.findById({ _id: id })
    const userDto = new UserDto(userName)
    await Token.deleteOne({ userName: userDto.name })
    await User.deleteOne({ _id: id })
    const user = await User.find()
    return res.json(user)
  }

  async updateUser(req, res, next) {
    const { id } = req.params
    const { firstName, lastName, email, gender, day, month, year, city, language, familyStatus } = req.body
    const user = await userService.updateUser(id, firstName, lastName, email, gender, day, month, year, city, language, familyStatus, next)
    return res.json(user)
  }

  async notification(req, res) {
    const { id } = req.params
    const notifications = await Notification.findOne({ user: id })

    return res.json(notifications)
  }

  async delete(req, res) {
    const {userId} = req.body
    await userService.delete(userId)

    return res.json('Пользователь удалён')
  }
}

module.exports = new UserController()
