const Router = require('express')
const router = new Router()

const userRouter = require('./user.router')
const positionRouter = require('./position.router')
const levelRouter = require('./level.router')
const chatRouter = require('./chat.router')
const followRouter = require('./followers.router')

router.use('/user', userRouter)
router.use('/position', positionRouter)
router.use('/level', levelRouter)
router.use('/chat', chatRouter)
router.use('/follow', followRouter)

module.exports = router
