const User = require('../models/user.model')
const ApiError = require('../error/api.error')
const tokenService = require('./token.service')
const UserDto = require('../dto/user.dto')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const path = require('path')
const Chat = require('../models/chat.model')

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
    const candidateUserName = await User.findOne({ name })
    if (candidateUserName) {
      return next(ApiError.badRequest('Пользователь с таким логином уже существует'))
    }
    const candidateEmail = await User.findOne({ email })
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
    await tokenService.saveToken(userDto.id, tokens.refreshToken)
    return { ...tokens, userDto }
  }

  async login(name, password, next) {
    const user = await User.findOne({ name: name }).select('+password')
    if (!user) {
      return next(ApiError.internal('Неверный логин'))
    }
    let comparePassword = await bcrypt.compareSync(password, user.password)
    if (!comparePassword) {
      return next(ApiError.internal('Неверный пароль'))
    }

    const userDto = new UserDto(user)
    await Chat.create({ user: userDto.id, chats: [] })

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

  async avatar(id, avatar) {
    const user = await User.findOne({ _id: id })
    let fileName = uuid.v4() + '.jpg'
    await avatar.mv(path.resolve(__dirname, '..', 'static/avatar', fileName))
    user.avatar = fileName
    await user.save()
    const userDto = new UserDto(user)
    return { user: userDto }
  }

  async updateUser(id, name, email, position, level, next) {
    const user = await User.findById(id)
    if (!user) {
      return next(ApiError.badRequest('Пользователь не найден'))
    }
    if (name) {
      const updateUser = await User.findOne({ name: name })
      if (updateUser) {
        return next(ApiError.badRequest('Логин занят'))
      } else {
        user.name = name
      }
    }
    if (email) {
      const updateEmail = await User.findOne({ email: email })
      if (updateEmail) {
        return next(ApiError.badRequest('Пользователь с таким email уже существует'))
      } else {
        user.email = email
      }
    }
    if (position) {
      user.position = position
    }
    if (level) {
      user.level = level
    }
    await user.save()
    const userDto = new UserDto(user)
    return { user: userDto }
  }
}

module.exports = new UserService()
