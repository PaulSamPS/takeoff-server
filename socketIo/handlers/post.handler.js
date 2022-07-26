const { likeOrUnlikePost, commentPost } = require('../services/post.service')

module.exports = function postHandler(io, socket) {
  socket.on('like:post', async ({ postId, userId, userToNotifyId, like }) => {
    const { likeId } = await likeOrUnlikePost(postId, userId, userToNotifyId, like)
    socket.emit('post:liked', { likeId })
  })

  socket.on('comment:post', async ({ postId, userId, text }) => {
    const { commentId } = await commentPost(postId, userId, text)
    socket.emit('post:commented', { commentId })
  })
}
