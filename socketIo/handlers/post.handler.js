const { likeOrUnlikePost, commentPost } = require('../services/post.service')

module.exports = function postHandler(io, socket) {
  socket.on('like:post', async ({ postId, userId, like }) => {
    const { success } = await likeOrUnlikePost(postId, userId, like)
    if (success) {
      socket.emit('post:liked')
    }
  })

  socket.on('comment:post', async ({ postId, userId, text }) => {
    const { commentId } = await commentPost(postId, userId, text)
    socket.emit('post:commented', { commentId })
  })
}
