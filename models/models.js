const sequelize = require('../db')
const { DataTypes } = require('sequelize')

const User = sequelize.define(
  'user',
  {
    id: { type: DataTypes.INTEGER, unique: true, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, required: true },
    email: { type: DataTypes.STRING, unique: true, required: true },
    position: { type: DataTypes.STRING, required: true },
    password: { type: DataTypes.STRING, required: true },
    level: { type: DataTypes.STRING, required: true },
    avatar: { type: DataTypes.STRING },
  },
  { timestamps: false }
)

const Position = sequelize.define(
  'position',
  {
    id: { type: DataTypes.INTEGER, unique: true, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, required: true },
  },
  { timestamps: false }
)

const Level = sequelize.define(
  'level',
  {
    id: { type: DataTypes.INTEGER, unique: true, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, required: true },
  },
  { timestamps: false }
)

const Token = sequelize.define(
  'token',
  {
    id: { type: DataTypes.INTEGER, unique: true, primaryKey: true, autoIncrement: true },
    userName: { type: DataTypes.STRING },
    refreshToken: { type: DataTypes.STRING(2048), ref: 'user' },
  },
  { timestamps: false }
)

module.exports = {
  User,
  Token,
  Position,
  Level,
}
