const { addUser, removeUser, getUser, userOnline } = require('../services/room.service')

module.exports = function userHandlers(io, socket) {
  socket.on('user:add', async ({ userId }) => {
    const users = await addUser(userId, socket.id)

    console.log(users)
    setInterval(() => {
      socket.emit('user_list:update', {
        users: users.filter((user) => user.userId),
      })
    }, 3000)
  })

  socket.on('userInfo:get', async ({ userId }) => {
    const { user } = await getUser(userId)
    socket.emit('userInfo:user', { user })
  })

  socket.on('logout', async () => {
    const { users } = await removeUser(socket.id)
    socket.emit('user_list:update', {
      users,
    })
  })

  socket.on('disconnect', async () => {
    await removeUser(socket.id)
  })
}
