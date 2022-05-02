const jwt = require('jsonwebtoken')
const { Token } = require('../models/models')

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: '24h',
    })
    const refreshToken = jwt.sign(payload, process.env.SECRET_REFRESH_KEY, {
      expiresIn: '30d',
    })
    return {
      accessToken,
      refreshToken,
    }
  }

  async saveToken(userName, refreshToken) {
    const tokenData = await Token.findOne({ where: { userName: userName } })
    if (tokenData) {
      tokenData.refreshToken = refreshToken
      return tokenData.save()
    }
    return await Token.create({ userName: userName, refreshToken })
  }
}

module.exports = new TokenService()
