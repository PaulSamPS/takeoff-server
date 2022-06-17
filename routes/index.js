const Router = require('express')
const router = new Router()

const userRouter = require('./user.router')
const positionRouter = require('./position.router')
const levelRouter = require('./level.router')
const chatRouter = require('./chat.router')
const followRouter = require('./followers.router')
const postRouter = require('./post.router')

router.use('/user', userRouter)
router.use('/position', positionRouter)
router.use('/level', levelRouter)
router.use('/chat', chatRouter)
router.use('/followers', followRouter)
router.use('/post', postRouter)

module.exports = router
