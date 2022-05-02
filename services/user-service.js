const { User } = require('../models/models')
const ApiError = require('../error/ApiError')
const tokenService = require('./token-service')
const UserDto = require('./dtos')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const path = require('path')
const fs = require('fs')

class UserService {
  async registration(name, email, position, level, password, next) {
    if (!email) {
      return next(ApiError.badRequest('Некорректный email'))
    }
    if (!password) {
      return next(ApiError.badRequest('Некорректный пароль'))
    }
    if (!name) {
      return next(ApiError.badRequest('Некорректне имя'))
    }
    const candidateUserName = await User.findOne({ where: { name } })
    if (candidateUserName) {
      return next(ApiError.badRequest('Пользователь с таким логином уже существует'))
    }
    const candidateEmail = await User.findOne({ where: { email } })
    if (candidateEmail) {
      return next(ApiError.badRequest('Пользователь с таким email уже существует'))
    }
    const hashPassword = await bcrypt.hash(password, 5)
    const user = await User.create({
      name,
      email,
      position,
      level,
      password: hashPassword,
    })
    const userDto = new UserDto(user)
    const tokens = tokenService.generateTokens({ ...userDto })
    await tokenService.saveToken(userDto.name, tokens.refreshToken)
    return { ...tokens, userDto }
  }

  async login(name, password, next) {
    const user = await User.findOne({ where: { name } })
    if (!user) {
      return next(ApiError.internal('Неверный логин'))
    }
    let comparePassword = bcrypt.compareSync(password, user.password)
    if (!comparePassword) {
      return next(ApiError.internal('Неверный пароль'))
    }
    user.isAuth = true
    await user.save()
    const userDto = new UserDto(user)
    const tokens = tokenService.generateTokens({ ...userDto })

    await tokenService.saveToken(userDto.name, tokens.refreshToken)
    return { ...tokens, user: userDto }
  }

  async logout(refreshToken, name) {
    const user = await User.findOne({ where: { name } })
    user.isAuth = false
    await user.save()
    return await tokenService.removeToken(refreshToken)
  }

  async refresh(refreshToken, next) {
    if (!refreshToken) {
      return next(ApiError.unauthorized('Не авторизован'))
    }
    const userData = tokenService.validateRefreshToken(refreshToken)
    const tokenFromDb = await tokenService.findToken(refreshToken)
    if (!userData || !tokenFromDb) {
      return next(ApiError.unauthorized('Не авторизован, нет токена'))
    }
    const user = await User.findOne({ userName: userData.name })
    const userDto = new UserDto(user)
    const tokens = tokenService.generateTokens({ ...userDto })

    await tokenService.saveToken(userDto.name, tokens.refreshToken)
    return { ...tokens, user: userDto }
  }

  async avatar(id, avatar) {
    const user = await User.findByPk(id)
    let fileName = uuid.v4() + '.jpg'
    await avatar.mv(path.resolve(__dirname, '..', 'static/avatar', fileName))
    await user.update({ avatar: fileName })
    const userDto = new UserDto(user)
    return { user: userDto }
  }
}

module.exports = new UserService()
