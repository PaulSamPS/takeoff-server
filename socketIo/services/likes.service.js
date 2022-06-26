const Post = require('../../models/post.model')
const User = require('../../models/user.model')

const likeOrUnlikePost = async (postId, userId, like) => {
  console.log(like)
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

module.exports = { likeOrUnlikePost }
