const Token = require('../models/token.model')
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

  async saveToken(user, refreshToken) {
    const tokenData = await Token.findOne({ user: user })
    if (tokenData) {
      tokenData.refreshToken = refreshToken
      return tokenData
    } else {
      return await Token.create({ user: user, refreshToken })
    }
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
    return Token.deleteOne({ refreshToken: refreshToken })
  }

  async findToken(refreshToken) {
    return Token.findOne({ refreshToken: refreshToken })
  }
}

module.exports = new TokenService()
