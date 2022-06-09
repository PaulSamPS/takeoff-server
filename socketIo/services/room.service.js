const User = require('../../models/user.model')
const bcrypt = require('bcrypt')
const UserDto = require('../../dto/user.dto')
const Chat = require('../../models/chat.model')
const tokenService = require('../../services/token.service')
const users = []

const loginSocket = async (name, password) => {
  const user = await User.findOne({ name: name }).select('+password')
  if (!user) {
    return { error: 'Неверный логин' }
  }
  if (user) {
    user.isOnline = true
    user.save()
  }

  let comparePassword = await bcrypt.compareSync(password, user.password)
  if (!comparePassword) {
    return { error: 'Неверный пароль' }
  }

  const userDto = new UserDto(user)
  await new Chat({ user: userDto.id, chats: [] }).save()

  const tokens = tokenService.generateTokens({ ...userDto })
  return { ...tokens, user: userDto }
}

const addUser = async (userId, socketId) => {
  const user = users.find((user) => user.userId === userId)
  const userDb = await User.findById(userId)

  if (user && user.socketId === socketId) {
    return { users, userDb }
  } else {
    if (user && user.socketId !== socketId) {
      removeUser(user.socketId)
    }
    const newUser = { userId, socketId }
    users.push(newUser)
    return { users, userDb }
  }
}

const logoutUser = async (userId) => {
  const userBD = await User.findById({ _id: userId })

  if (userBD) {
    userBD.isOnline = false
    userBD.save()
  }
}

const userOnline = (userId, socketId) => {
  const user = users.find((user) => user.userId === userId)

  if (user.socketId === socketId) {
    removeUser(user.socketId)
  }
  return { users }
}

const getUser = async (userId) => {
  const user = await User.findById(userId)
  return {user}
}

const removeUser = async (socketId) => {
  const userId = users.find((user) => user.socketId === socketId);
  const lastVisit = await User.findOne(userId)
  lastVisit.lastVisit = Date.now();
  lastVisit.save();
  const indexOf = users.map((user) => user.socketId).indexOf(socketId)
  users.splice(indexOf, 1)
}

const findConnectedUser = (userId) => users.find((user) => user.userId === userId)

module.exports = { addUser, removeUser, findConnectedUser, loginSocket, logoutUser, userOnline , getUser}
