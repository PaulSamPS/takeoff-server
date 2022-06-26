const { likeOrUnlikePost } = require('../services/likes.service')

module.exports = function likesHandler(io, socket) {
  socket.on('like:post', async ({ postId, userId, like }) => {
    const { success } = await likeOrUnlikePost(postId, userId, like)
    if (success) {
      socket.emit('post:liked')
    }
  })
}
