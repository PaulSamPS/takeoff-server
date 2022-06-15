const { followersGet, follow, unfollow } = require('../services/followers.service')
module.exports = function followersHandlers(io, socket) {
  const sent = (followersUser) => {
    socket.emit('followers:sent', { followersUser })
  }

  socket.on('followers:get', async ({ userId }) => {
    const { followersUser } = await followersGet(userId)
    socket.emit('followers:sent', { followersUser })
  })

  socket.on('follow', async ({ userId, userToFollowId }) => {
    await follow(userId, userToFollowId)
    const { followersUser } = await followersGet(userId)

    io.emit('follow:done', { followersUser })
  })

  socket.on('unfollow', async ({ userId, userToUnfollowId }) => {
    await unfollow(userId, userToUnfollowId)

    const { followersUser } = await followersGet(userId)

    io.emit('follow:done', { followersUser })
  })
}
