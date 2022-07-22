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

  async updateUser(id, firstName, lastName, email, birthday, city, language, familyStatus, next) {
    const user = await User.findById(id)

    if (!user) {
      return next(ApiError.badRequest('Пользователь не найден'))
    }

    if (firstName) {
      user.firstName = firstName
    }

    if (lastName) {
      user.lastName = lastName
    }

    if (email) {
      const updateEmail = await User.findOne({ email: email })
      if (updateEmail) {
        return next(ApiError.badRequest('Пользователь с таким email уже существует'))
      } else {
        user.email = email
      }
    }

    if (birthday) {
      user.bio.birthday = birthday
    }

    if (city) {
      user.bio.city = city
    }

    if (language) {
      user.bio.language = language
    }

    if (familyStatus) {
      user.bio.familyStatus = familyStatus
    }

    await user.save()

    const userDto = new UserDto(user)

    return { user: userDto }
  }
}

module.exports = new UserService()
