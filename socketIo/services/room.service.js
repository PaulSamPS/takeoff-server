const User = require('../../models/user.model')
const users = []

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

const userOnline = (userId, socketId) => {
  const user = users.find((user) => user.userId === userId)

  if (user) {
    removeUser(user.socketId)
  }
  return { users }
}

const getUser = async (userId) => {
  const user = await User.findById(userId)
  return { user }
}

const removeUser = async (socketId) => {
  const indexOf = users.map((user) => user.socketId).indexOf(socketId)
  const lastVisitUser = users.find((user) => user.socketId === socketId)
  const lastVisit = await User.findById(lastVisitUser.userId)
  users.splice(indexOf, 1)
  lastVisit.lastVisit = Date.now()
  lastVisit.save()
}

const findConnectedUser = (userId) => users.find((user) => user.userId === userId)

module.exports = { addUser, removeUser, findConnectedUser, userOnline, getUser }
