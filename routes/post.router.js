const Router = require('express')
const router = new Router()
const postController = require('../controllers/post.controller')

router.post('/create', postController.create)
router.post('/like/:postId', postController.likePost)
router.get('/:userId', postController.getAll)

module.exports = router
