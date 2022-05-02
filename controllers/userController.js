const userService = require('../services/user-service')

class UserController {
  async registration(req, res, next) {
    try {
      const { name, email, profession, password, role } = req.body

      const userData = await userService.registration(name, email, profession, password, role, next)

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
