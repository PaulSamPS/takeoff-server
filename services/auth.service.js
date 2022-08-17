const ApiError = require('../error/api.error')
const User = require('../models/user.model')
const Notification = require('../models/notification.model')
const bcrypt = require('bcrypt')
const UserDto = require('../dto/user.dto')
const Chat = require('../models/chat.model')
const Followers = require('../models/followers.model')
const tokenService = require('./token.service')

class AuthService {
  async login(email, password, next) {
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
    if (!user) {
      return next(ApiError.internal('Неверный логин'))
    }
    let comparePassword = await bcrypt.compareSync(password, user.password)
    if (!comparePassword) {
      return next(ApiError.internal('Неверный пароль'))
    }
    await user.save()
    const userDto = new UserDto(user)

    const tokens = tokenService.generateTokens({ ...userDto })
    await tokenService.saveToken(userDto.id, tokens.refreshToken)
    return { ...tokens, user: userDto }
  }

  async logout(refreshToken) {
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
    const user = await User.findById(userData.id)
    const userDto = new UserDto(user)
    const tokens = tokenService.generateTokens({ ...userDto })
    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return { ...tokens, user: userDto }
  }
}

module.exports = new AuthService()
