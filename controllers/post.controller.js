const Post = require('../models/post.model')
const Followers = require('../models/followers.model')
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

  async getAll(req, res, next) {
    const { pageNumber } = req.body
    const { userId } = req.params

    const number = Number(pageNumber)
    const size = 8

    try {
      let posts

      if (number === 1) {
        posts = await Post.find().limit(size).sort({ createdAt: -1 }).populate('user').populate('comments.user')
      } else {
        const skips = size * (number - 1)
        posts = await Post.find().skip(skips).limit(size).sort({ createdAt: -1 }).populate('user').populate('comments.user')
      }

      if (posts.length === 0) {
        return res.json([])
      }

      let postsToBeSent = []

      const loggedUser = await Followers.findOne({ user: userId })

      if (loggedUser.friends.length === 0) {
        postsToBeSent = posts.filter((post) => post.user._id.toString() === userId)
      } else {
        for (let i = 0; i < loggedUser.friends.length; i++) {
          const foundPostsFromFriends = posts.filter((post) => post.user._id.toString() === loggedUser.friends[i].user.toString())

          if (foundPostsFromFriends.length > 0) postsToBeSent.push(...foundPostsFromFriends)
        }
        const foundOwnPosts = posts.filter((post) => post.user._id.toString() === userId)
        if (foundOwnPosts.length > 0) postsToBeSent.push(...foundOwnPosts)
      }

      postsToBeSent.length > 0 && postsToBeSent.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

      return res.json(postsToBeSent)
    } catch (error) {
      console.error(error)
      return next(ApiError.badRequest('Что-т пошло не так'))
    }
  }
}

module.exports = new PostController()
