const User = require('../models/user.model')
const Token = require('../models/token.model')
const userService = require('../services/user.service')
const ApiError = require('../error/api.error')
const UserDto = require('../dto/user.dto')
const path = require('path')
const fs = require('fs')

class UserController {
  async getAll(req, res) {
    const user = await User.find()
    const userDto = user.map((u) => new UserDto(u))
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

  async avatar(req, res) {
    const { id } = req.params
    const { avatar } = req.files
    const user = await userService.avatar(id, avatar)
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
}

module.exports = new UserController()
