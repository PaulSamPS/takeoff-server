const Router = require('express')
const router = new Router()

const userRouter = require('./user.router')
const positionRouter = require('./position.router')
const levelRouter = require('./level.router')
const chatRouter = require('./chat.router')

router.use('/user', userRouter)
router.use('/position', positionRouter)
router.use('/level', levelRouter)
router.use('/chat', chatRouter)

module.exports = router
