const authService = require('../services/auth.service')
const City = require('../models/cities.model')
const User = require('../models/user.model')

class AuthController {
  async registration(req, res, next) {
    try {
      const { firstName, lastName, email, city, gender, password } = req.body

      const userData = await authService.registration(firstName, lastName, email, city, gender, password, next)
      await res.cookie('refreshToken', userData.refreshToken, {
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
