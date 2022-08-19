const User = require('../models/user.model')
const Post = require('../models/post.model')
const Followers = require('../models/followers.model')
const Notification = require('../models/notification.model')
const Chat = require('../models/chat.model')
const Token = require('../models/token.model')
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

  async updateUser(id, firstName, lastName, email, gender, day, month, year, city, language, familyStatus, next) {
    const user = await User.findById(id)

    if (!user) {
      return next(ApiError.badRequest('Пользователь не найден'))
    }

    if (firstName) {
      user.name.firstName = firstName
    }

    if (lastName) {
      user.name.lastName = lastName
    }

    if (email) {
      const updateEmail = await User.findOne({ email: email })
      if (updateEmail) {
        return next(ApiError.badRequest('Пользователь с таким email уже существует'))
      } else {
        user.email = email
      }
    }

    if (gender) {
      user.bio.gender = gender
    }

    if (day) {
      user.bio.birthday.day = day
    }

    if (month) {
      user.bio.birthday.month = month
    }

    if (year) {
      user.bio.birthday.year = year
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

  async delete(userId) {
    await User.findByIdAndDelete(userId)
    await Post.findOneAndDelete({user: userId})
    await Followers.findOneAndDelete({user: userId})
    await Chat.findOneAndDelete({user: userId})
    await Notification.findOneAndDelete({user: userId})
    await Token.findOneAndDelete({user: userId})
  }
}

module.exports = new UserService()
