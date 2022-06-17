const Router = require('express')
const router = new Router()
const postController = require('../controllers/post.controller')

router.post('/create', postController.create)

module.exports = router
