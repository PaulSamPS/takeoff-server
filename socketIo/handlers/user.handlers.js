const { addUser, removeUser, loginSocket, logoutUser, userOnline } = require('../services/room.service')

module.exports = function userHandlers(io, socket) {
  // socket.on('login', async ({ name, password }) => {
  //   const userData = await loginSocket(name, password)
  //   socket.emit('login:success', { accessToken: userData.accessToken, user: userData.user })
  // })

  socket.on('user:add', async ({ userId }) => {
    const { users, userDb } = await addUser(userId, socket.id)
    userDb.isOnline = true
    userDb.save()

    setInterval(() => {
      socket.emit('user_list:update', {
        users: users.filter((user) => user.userId !== userId),
      })
    }, 3000)
  })

  socket.on('user:online', (users) => {
    userOnline(users)
  })

  socket.on('logout', ({ userId }) => {
    const { users } = userOnline(userId, socket.id)

    socket.emit('user_list:update', {
      users: users.filter((user) => user.userId !== userId),
    })
  })

  socket.on('disconnect', () => {
    removeUser(socket.id)
  })
}
