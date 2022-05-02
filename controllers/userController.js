const userService = require('../services/user-service')
const { User } = require('../models/models')

class UserController {
  async registration(req, res, next) {
    try {
      const { name, email, position, level, password } = req.body

      const userData = await userService.registration(name, email, position, level, password, next)

      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true,
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
      const { password, name } = req.body
      const userData = await userService.login(name, password, next)
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true,
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
    const { name } = req.body
    const { refreshToken } = req.cookies
    await userService.logout(refreshToken, name)
    res.clearCookie('refreshToken')
    return res.json({ message: 'Выход выполнен' })
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies
      const userData = await userService.refresh(refreshToken, next)
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true,
      })
      return res.json({
        accessToken: userData.accessToken,
      })
    } catch (e) {
      next(e)
    }
  }

  async getAll(req, res) {
    const user = await User.findAndCountAll()
    return res.json(user)
  }

  async getOne(req, res, next) {
    const { id } = req.params
    const user = await userService.getOne(id, next)
    return res.json(user)
  }
}

module.exports = new UserController()
