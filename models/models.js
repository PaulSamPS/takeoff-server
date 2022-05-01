const sequelize = require('../db')
const { DataTypes } = require('sequelize')

const User = sequelize.define('user', {
  id: { type: DataTypes.STRING(2048), unique: true, primaryKey: true },
  name: { type: DataTypes.STRING, unique: true, required: true },
  email: { type: DataTypes.STRING, unique: true, required: true },
  profession: { type: DataTypes.STRING, unique: true, required: true },
  avatar: { type: DataTypes.STRING },
  password: { type: DataTypes.STRING, required: true },
  role: { type: DataTypes.STRING, defaultValue: 'USER', required: true },
})

const Token = sequelize.define('token', {
  id: { type: DataTypes.STRING(2048), unique: true, primaryKey: true },
  userId: { type: DataTypes.STRING(2048) },
  refreshToken: { type: DataTypes.STRING(2048), ref: 'user' },
})

module.exports = {
  User,
  Token,
}
