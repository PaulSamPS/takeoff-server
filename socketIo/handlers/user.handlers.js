const { addUser, removeUser, getUser, userOnline } = require('../services/room.service')

module.exports = function userHandlers(io, socket) {
  socket.on('user:add', async ({ userId }) => {
    const usersOnline = await addUser(userId, socket.id)

    socket.emit('user_list:update', {
      usersOnline: usersOnline.filter((u) => u.userId !== userId),
    })
  })

  socket.on('userInfo:get', async ({ userId }) => {
    const { user } = await getUser(userId)
    socket.emit('userInfo:user', { user })
  })

  socket.on('logout', async () => {
    await removeUser(socket.id)
  })

  socket.on('disconnect', async () => {
    await removeUser(socket.id)
  })
}
