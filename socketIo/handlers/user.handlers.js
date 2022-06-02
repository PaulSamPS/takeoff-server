const { addUser, removeUser } = require('../services/room.service')

module.exports = function userHandlers(io, socket) {
  socket.on('user:add', async ({ userId }) => {
    const users = await addUser(userId, socket.id)

    setInterval(() => {
      socket.emit('user_list:update', {
        users: users.filter((user) => user.userId !== userId),
      })
    }, 10000)
  })

  socket.on('disconect', () => removeUser(socket.id))
}
