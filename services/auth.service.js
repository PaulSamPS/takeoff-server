const ApiError = require('../error/api.error')
const User = require('../models/user.model')
const Notification = require('../models/notification.model')
const bcrypt = require('bcrypt')
const UserDto = require('../dto/user.dto')
const Chat = require('../models/chat.model')
const Followers = require('../models/followers.model')
const tokenService = require('./token.service')

class AuthService {
  async registration(firstName, lastName, email, city, gender, day, month, year, familyStatus, language, password, next) {
    if (!password) {
      return next(ApiError.badRequest('Некорректный пароль'))
    }
    const candidateEmail = await User.findOne({ email: email })
    if (candidateEmail) {
      return next(ApiError.badRequest('Пользователь с таким email уже существует'))
    }
    const hashPassword = await bcrypt.hash(password, 5)
    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashPassword,
      bio: {
        city,
        gender,
        birthday: {
          day,
          month,
          year,
        },
        familyStatus,
        language,
      },
    })
    const userDto = new UserDto(user)

    await new Chat({ user: userDto.id, chats: [] }).save()
    await new Followers({ user: userDto.id, followers: [], following: [], friends: [] }).save()
    await new Notification({ user: userDto.id, notifications: [] }).save()

    const tokens = tokenService.generateTokens({ ...userDto })
    await tokenService.saveToken(userDto.id, tokens.refreshToken)
    return { ...tokens, user: userDto }
  }

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
