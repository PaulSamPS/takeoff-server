const Post = require('../../models/post.model')
const User = require('../../models/user.model')
const uuid = require('uuid')

const likeOrUnlikePost = async (postId, userId, userToNotifyId, like) => {
  try {
    const post = await Post.findById(postId)
    const userToNotify = await User.findById(userToNotifyId)

    if (!post) return { error: 'Пост не найден' }

    if (like) {
      const isLiked = post.likes.filter((like) => like.user.toString() === userId).length > 0
      if (isLiked) return { error: 'Вам уже нравится этот пост' }

      const newLike = {
        _id: uuid.v4(),
        user: userId,
      }

      const newNotification = {
        type: 'newLike',
        user: userId,
        post: postId,
        date: Date.now(),
      }

      await post.likes.unshift(newLike)
      await post.save()

      await userToNotify.notifications.unshift(newNotification)
      await userToNotify.save()

      return { likeId: newLike._id }
    } else {
      const isLiked = post.likes.filter((like) => like.user.toString() === userId).length === 0

      if (isLiked) return { error: 'Вам не нравился этот пост' }

      const indexOf = post.likes.map((like) => like.user.toString()).indexOf(userId)

      await post.likes.splice(indexOf, 1)

      await post.save()
    }

    return {
      success: true,
    }
  } catch (error) {
    return { error: 'Ошибка!!!' }
  }
}

const commentPost = async (postId, userId, text) => {
  const post = await Post.findById(postId)

  if (!post) return 'Пост не найден'

  const newComment = {
    _id: uuid.v4(),
    text,
    user: userId,
    date: Date.now(),
  }

  await post.comments.unshift(newComment)
  await post.save()

  return { commentId: newComment._id }
}

module.exports = { likeOrUnlikePost, commentPost }
