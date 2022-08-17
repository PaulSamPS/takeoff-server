const Post = require('../models/post.model')
const Followers = require('../models/followers.model')
const Notification = require('../models/notification.model')
const ApiError = require('../error/api.error')
const uuid = require('uuid')
const path = require('path')

class PostController {
  async create(req, res, next) {
    const { id, text, location } = req.body
    const { image } = req.files !== undefined && req.files

    try {
      const newPost = {
        user: id,
        text,
      }
      if (location) newPost.location = location
      if (image) {
        let fileName = uuid.v4() + '.jpg'
        await image.mv(path.resolve(__dirname, '..', 'static/post', fileName))
        newPost.image = fileName
      }

      const post = await new Post(newPost).save()

      const postCreated = await Post.findById(post._id).populate('user')

      return res.json(postCreated)
    } catch (error) {
      console.error(error)
      return next(ApiError.badRequest('Что-т пошло не так'))
    }
  }

  async deletePost(req, res, next) {
    const { postId } = req.params
    const { userId } = req.body

    const post = await Post.findByIdAndDelete(postId)

    if (!post) {
      return next(ApiError.badRequest('Пост не найден'))
    }

    const userNotifications = await Notification.findOne({ user: userId })
    await Notification.updateOne({ _id: userNotifications._id }, { $pull: { notifications: { post: postId } } })

    return res.json('Пост удалён')
  }
}

module.exports = new PostController()
