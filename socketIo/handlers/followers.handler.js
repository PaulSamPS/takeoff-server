const { followersGet, follow, unfollow, addToFriends, friendsRequestGet, friendsGet } = require('../services/followers.service')
module.exports = function followersHandlers(io, socket) {
  socket.on('followings:get', async ({ userId }) => {
    const { followingsUser, followersUser } = await followersGet(userId)
    socket.emit('followings:sent', { followingsUser, followersUser })
  })

  socket.on('follow', async ({ userId, userToFollowId }) => {
    await follow(userId, userToFollowId)
    const { followingsUser, followersUser } = await followersGet(userId)

    io.emit('followings:done', { followingsUser, followersUser })
  })

  socket.on('unfollow', async ({ userId, userToUnfollowId }) => {
    await unfollow(userId, userToUnfollowId)
    const { followingsUser, followersUser } = await followersGet(userId)

    io.emit('followings:done', { followingsUser, followersUser })
  })

  socket.on('friendsRequest:get', async ({ userId }) => {
    const { followersUser } = await friendsRequestGet(userId)
    socket.emit('friendsRequest:sent', { followersUser })
  })

  socket.on('friends:add', async ({ userId, userToFriendId }) => {
    const { userFriends } = await addToFriends(userId, userToFriendId)
    io.emit('friends:sent', { userFriends })
  })

  socket.on('friends:get', async ({ userId }) => {
    const { friendsUser } = await friendsGet(userId)
    io.emit('friends:set', { friendsUser })
  })
}
