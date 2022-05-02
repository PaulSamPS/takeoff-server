const ApiError = require('../error/ApiError')
const { User } = require('../models/models')
const tokenService = require('./token-service')
const UserDto = require('./dtos')
const bcrypt = require('bcrypt')

class UserService {
  async registration(name, email, profession, password, role, next) {
    if (!email) {
      return next(ApiError.internal('Некорректный email'))
    }
    if (!password) {
      return next(ApiError.internal('Некорректный пароль'))
    }
    if (!name) {
      return next(ApiError.internal('Некорректне имя'))
    }
    const candidateUserName = await User.findOne({ where: { name } })
    if (candidateUserName) {
      return next(ApiError.internal('Пользователь с таким логином уже существует'))
    }
    const candidateEmail = await User.findOne({ where: { email } })
    if (candidateEmail) {
      return next(ApiError.internal('Пользователь с таким email уже существует'))
    }
    const hashPassword = await bcrypt.hash(password, 5)
    const user = await User.create({
      name,
      email,
      profession,
      role,
      password: hashPassword,
    })
    const userDto = new UserDto(user)
    const tokens = tokenService.generateTokens({ ...userDto })
    await tokenService.saveToken(userDto.name, tokens.refreshToken)
    return { ...tokens, userDto }
  }
}

module.exports = new UserService()
