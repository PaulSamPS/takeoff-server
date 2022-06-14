const Router = require('express')
const router = new Router()
const followersController = require('../controllers/followers.controller')
const auth = require('../middleware/auth.middleware')

router.post('/:userToFollowId', followersController.append)

module.exports = router
