const Router = require('express')
const router = new Router()
const userController = require('../controllers/user.controller')
const auth = require('../middleware/auth.middleware')

router.post('/:id/upload/avatar/', userController.uploadAvatar)
router.post('/:id/remove/avatar/:avatar', userController.removeAvatar)
router.post('/:id/remove/:avatar', userController.removeUser)
router.post('/update/:id', userController.updateUser)
router.post('/search', userController.getUsersSearch)
router.post('/', userController.getAll)
router.post('/delete', userController.delete)
router.get('/notifications/:id', userController.notification)
router.get('/:id', userController.getOne)

module.exports = router
