const Post = require('../models/post.model')
const ApiError = require('../error/api.error')
const uuid = require('uuid')
const path = require('path')

class PostController {
  async create(req, res, next) {
    const { id, text, location } = req.body
    const { image } = req.files

    try {
      const newPost = {
        user: id,
        text,
      }
      if (location) newPost.location = location
      if (image) {
        let fileName = uuid.v4() + '.jpg'
        await image.mv(path.resolve(__dirname, '..', 'static/post', fileName))
        newPost.picUrl = fileName
      }

      const post = await new Post(newPost).save()

      const postCreated = await Post.findById(post._id).populate('user')

      return res.json(postCreated)
    } catch (error) {
      console.error(error)
      return next(ApiError.badRequest('Что-т пошло не так'))
    }
  }
}

module.exports = new PostController()
