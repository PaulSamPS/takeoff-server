const { User } = require('../models/models')
const ApiError = require('../error/ApiError')
const tokenService = require('./token-service')
const UserDto = require('./dtos')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const path = require('path')

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
    const userDto = new UserDto(user)
    const tokens = tokenService.generateTokens({ ...userDto })

    await tokenService.saveToken(userDto.name, tokens.refreshToken)
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

  async updateUser(id, name, email, position, level, next) {
    const user = await User.findByPk(id)
    if (!user) {
      return next(ApiError.badRequest('Пользователь не найден'))
    }
    if (name) {
      const updateUser = await User.findOne({ where: { name } })
      if (updateUser) {
        return next(ApiError.badRequest('Логин занят'))
      } else {
        await user.update({ name })
      }
    }
    if (email) {
      const updateEmail = await User.findOne({ where: { email } })
      if (updateEmail) {
        return next(ApiError.badRequest('Пользователь с таким email уже существует'))
      } else {
        await user.update({ email })
      }
    }
    if (position) {
      await user.update({ position })
    }
    if (level) {
      await user.update({ level })
    }
    const userDto = new UserDto(user)
    return { user: userDto }
  }
}

module.exports = new UserService()
