const Post = require('../../models/post.model')
const User = require('../../models/user.model')
const ApiError = require('../../error/api.error')
const uuid = require('uuid')

const likeOrUnlikePost = async (postId, userId, like) => {
  try {
    const post = await Post.findById(postId)

    if (!post) return { error: 'Пост не найден' }

    if (like) {
      const isLiked = post.likes.filter((like) => like.user.toString() === userId).length > 0

      if (isLiked) return { error: 'Вам уже нравится этот пост' }

      await post.likes.unshift({ user: userId })

      await post.save()
    } else {
      const isLiked = post.likes.filter((like) => like.user.toString() === userId).length === 0

      if (isLiked) return { error: 'Вам не нравился этот пост' }

      const indexOf = post.likes.map((like) => like.user.toString()).indexOf(userId)

      await post.likes.splice(indexOf, 1)

      await post.save()
    }

    const user = await User.findById(userId)

    const { name, avatar } = user

    return {
      success: true,
      name,
      avatar,
      postByUserId: post.user.toString(),
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
