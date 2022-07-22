const Router = require('express')
const router = new Router()
const userController = require('../controllers/user.controller')
const auth = require('../middleware/auth.middleware')

router.post('/:id/upload/avatar/', userController.avatar)
router.post('/:id/remove/avatar/:avatar', userController.removeAvatar)
router.post('/:id/remove/:avatar', userController.removeUser)
router.post('/update/:id', userController.updateUser)
router.get('/', userController.getAll)
router.get('/:id', userController.getOne)

module.exports = router
