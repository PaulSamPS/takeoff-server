const Router = require('express')
const router = new Router()
const followersController = require('../controllers/followers.controller')
const auth = require('../middleware/auth.middleware')

router.post('/follow/:userToFollowId', followersController.folow)
router.post('/unfollow/:userToUnfollowId', followersController.unfollow)

module.exports = router
