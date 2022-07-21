const User = require('../models/user.model')
const ApiError = require('../error/api.error')
const UserDto = require('../dto/user.dto')
const uuid = require('uuid')
const path = require('path')

class UserService {
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
