const Router = require('express')
const router = new Router()

const userRouter = require('./userRouter')
const positionRouter = require('./positionRouter')
const levelRouter = require('./levelRouter')

router.use('/user', userRouter)
router.use('/position', positionRouter)
router.use('/level', levelRouter)

module.exports = router
