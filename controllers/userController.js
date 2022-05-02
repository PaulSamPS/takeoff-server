const userService = require('../services/user-service')

class UserController {
  async registration(req, res, next) {
    try {
      const { name, email, position, level, password, role } = req.body

      const userData = await userService.registration(name, email, position, level, password, role, next)

      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
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
        maxAge: 30 * 24 * 60 * 60 * 1000,
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
}

module.exports = new UserController()
