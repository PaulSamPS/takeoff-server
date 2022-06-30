const User = require('../../models/user.model')
const users = []

const addUser = async (userId, socketId) => {
  const user = users.find((user) => user.userId === userId)
  const userBD = await User.findById(userId)

  if (user && user.socketId === socketId) {
    return { users }
  } else {
    if (user && user.socketId !== socketId) {
      await removeUser(user.socketId)
      userBD.isOnline = false
      await userBD.save()
    }
    const newUser = { userId, socketId }
    userBD.isOnline = true
    await userBD.save()
    users.push(newUser)
    return { users }
  }
}

const removeUser = async (socketId) => {
  const indexOf = users.map((user) => user.socketId).indexOf(socketId)
  const lastVisitUser = users.find((user) => user.socketId === socketId)
  const lastVisit = await User.findById(lastVisitUser && lastVisitUser.userId)
  if (lastVisit) {
    lastVisit.lastVisit = Date.now()
    lastVisit.isOnline = false
    lastVisit.save()
  }
  users.splice(indexOf, 1)

  return { users }
}

const getUser = async (userId) => {
  const user = await User.findById(userId)
  return { user }
}

const findConnectedUser = (userId) => users.find((user) => user.userId === userId)

module.exports = { addUser, removeUser, findConnectedUser, getUser }
