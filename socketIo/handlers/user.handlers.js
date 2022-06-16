const { addUser, removeUser, getUser, userOnline } = require('../services/room.service')

module.exports = function userHandlers(io, socket) {
  socket.on('user:add', async ({ userId }) => {
    const { users, userDb } = await addUser(userId, socket.id)
    userDb.isOnline = true
    userDb.save()

    setInterval(() => {
      socket.emit('user_list:update', {
        users,
      })
    }, 3000)
  })

  socket.on('user:online', (users) => {
    userOnline(users)
  })

  socket.on('userInfo:get', async ({ userId }) => {
    const { user } = await getUser(userId)
    socket.emit('userInfo:user', { user })
  })

  socket.on('logout', ({ userId }) => {
    const { users } = userOnline(userId, socket.id)

    socket.emit('user_list:update', {
      users: users.filter((user) => user.userId !== userId),
    })
  })

  socket.on('disconnect', async () => {
    await removeUser(socket.id)
  })
}
