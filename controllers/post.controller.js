const Post = require('../models/post.model')
const Notification = require('../models/notification.model')
const ApiError = require('../error/api.error')
const path = require('path')
const fs = require('fs')

class PostController {
  async create(req, res, next) {
    const { id, text, location } = req.body
    const image = req.file

    try {
      const newPost = {
        user: id,
        text: text ? text : null,
      }
      if (location) newPost.location = location
      if (image) {
        newPost.image = image.filename
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
    const { userId, image } = req.body

    const post = await Post.findByIdAndDelete(postId)

    if (!post) {
      return next(ApiError.badRequest('Пост не найден'))
    }

    if (image !== null && image !== undefined) {
      fs.unlink(path.resolve(__dirname, '..', 'static/post', image), function (err) {
        if (err) throw err
        console.log('Файл удален')
      })
    }

    const userNotifications = await Notification.findOne({ user: userId })
    await Notification.updateOne({ _id: userNotifications._id }, { $pull: { notifications: { post: postId } } })

    return res.json('Пост удалён')
  }
}

module.exports = new PostController()
