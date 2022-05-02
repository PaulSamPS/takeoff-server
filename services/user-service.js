const { User } = require('../models/models')
const ApiError = require('../error/ApiError')
const tokenService = require('./token-service')
const UserDto = require('./dtos')
const bcrypt = require('bcrypt')

class UserService {
  async registration(name, email, position, level, password, role, next) {
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
      role,
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
      return next(ApiError.internal('Пользователь с таким логином не найден'))
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
}

module.exports = new UserService()
