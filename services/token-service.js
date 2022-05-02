const { Token } = require('../models/models')
const jwt = require('jsonwebtoken')

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

  validateAccessToken(token) {
    try {
      return jwt.verify(token, process.env.SECRET_KEY)
    } catch (e) {
      return null
    }
  }

  validateRefreshToken(token) {
    try {
      return jwt.verify(token, process.env.SECRET_REFRESH_KEY)
    } catch (e) {
      return null
    }
  }

  async removeToken(refreshToken) {
    return await Token.destroy({ where: { refreshToken } })
  }

  async findToken(refreshToken) {
    return await Token.findOne({ where: { refreshToken } })
  }
}

module.exports = new TokenService()
