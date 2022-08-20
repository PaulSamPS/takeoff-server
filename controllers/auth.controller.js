const authService = require('../services/auth.service')
const City = require('../models/cities.model')
const User = require('../models/user.model')
const ApiError = require("../error/api.error");
const bcrypt = require("bcrypt");
const UserDto = require("../dto/user.dto");
const Chat = require("../models/chat.model");
const Followers = require("../models/followers.model");
const Notification = require("../models/notification.model");
const tokenService = require("../services/token.service");

class AuthController {
  async registration(req, res, next) {
    const { firstName, lastName, email, city, gender, password } = req.body

    if (!password) {
      return next(ApiError.badRequest('Некорректный пароль'))
    }

    const candidateEmail = await User.findOne({ email: email })
    if (candidateEmail) {
      return next(ApiError.badRequest('Пользователь с таким email уже зарегистрирован'))
    }

    const hashPassword = await bcrypt.hash(password, 5)
    const user = await User.create({
      name: {
        firstName,
        lastName,
      },
      email: email.toLowerCase(),
      password: hashPassword,
      bio: {
        city,
        gender,
      },
    })
    const userDto = new UserDto(user)

    await new Chat({ user: userDto.id, chats: [] }).save()
    await new Followers({ user: userDto.id, followers: [], following: [], friends: [] }).save()
    await new Notification({ user: userDto.id, notifications: [] }).save()

    const tokens = tokenService.generateTokens({ ...userDto })
    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    await res.cookie('refreshToken', tokens.refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    })
    return res.json({
      accessToken: tokens.accessToken,
      user: userDto,
    })
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body
      const userData = await authService.login(email, password, next)
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      })
      return res.json({
        accessToken: userData.accessToken,
        user: userData.user,
      })
    } catch (e) {
      console.log(e)
    }
  }

  async changePassword(req,res,next) {
    const {userId, currentPassword, newPassword, repeatNewPassword} = req.body
    await authService.changePassword(userId,currentPassword,newPassword,repeatNewPassword, res, next)
  }

  async logout(req, res) {
    const { refreshToken } = req.cookies
    await authService.logout(refreshToken)
    res.clearCookie('refreshToken')
    return res.json({ message: 'Выход выполнен' })
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies
      const userData = await authService.refresh(refreshToken, next)
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      })
      return res.json({
        refreshToken: userData.refreshToken,
        accessToken: userData.accessToken,
        user: userData.user,
      })
    } catch (e) {
      next(e)
    }
  }

  async settings(req, res) {
    const { userId, notification } = req.body
    console.log(userId)
    const user = await User.findById(userId)

    if (!user) {
      return 'Пользователь не найден'
    }

    user.settings.notification.messagesToast = notification
    await user.save()

    return res.json('Обновлено')
  }

  async getCity(req, res) {
    const cities = await City.find()
    return res.json(cities)
  }
}

module.exports = new AuthController()
