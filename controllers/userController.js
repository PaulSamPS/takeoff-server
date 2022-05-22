const User = require('../models/userModel')
const Token = require('../models/tokenModel')
const userService = require('../services/user-service')
const ApiError = require('../error/ApiError')
const UserDto = require('../services/dtos')
const path = require('path')
const fs = require('fs')

class UserController {
  async registration(req, res, next) {
    try {
      const { name, email, position, level, password } = req.body

      const userData = await userService.registration(name, email, position, level, password, next)

      await res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true,
      })
      return res.json({
        accessToken: userData.accessToken,
        user: userData.user,
      })
    } catch (e) {
      console.log(e)
    }
  }

  async login(req, res, next) {
    try {
      const { name, password } = req.body
      const userData = await userService.login(name, password, next)
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true,
      })
      return res.json({
        accessToken: userData.accessToken,
        user: userData.user,
      })
    } catch (e) {
      console.log(e)
    }
  }

  async logout(req, res) {
    const { refreshToken } = req.cookies
    await userService.logout(refreshToken)
    res.clearCookie('refreshToken')
    return res.json({ message: 'Выход выполнен' })
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies
      const userData = await userService.refresh(refreshToken, next)
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true,
      })
      return res.json({
        refreshToken: userData.refreshToken,
        accessToken: userData.accessToken,
        user: userData.user,
      })
    } catch (e) {
      next(e)
    }
  }

  async getAll(req, res) {
    const user = await User.find()
    return res.json(user)
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
    const { name, email, position, level } = req.body
    const user = await userService.updateUser(id, name, email, position, level, next)
    return res.json(user)
  }
}

module.exports = new UserController()
