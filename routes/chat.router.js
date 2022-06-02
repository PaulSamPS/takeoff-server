const Router = require('express')
const router = new Router()
const chatController = require('../controllers/chat.controller')

router.get('/:userId', chatController.getAll)
router.get('/user/:id', chatController.getChatUser)
router.delete('/:messagesWith', chatController.deleteChat)

module.exports = router
