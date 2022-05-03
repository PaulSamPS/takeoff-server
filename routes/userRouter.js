const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')

router.post('/login', userController.login)
router.post('/registration', userController.registration)
router.post('/logout', userController.logout)
router.post('/:id/upload/avatar/', userController.avatar)
router.post('/:id/remove/avatar/:avatar', userController.removeAvatar)
router.post('/:id/remove', userController.removeUser)
router.post('/:id/update', userController.updateUser)
router.get('/refresh', userController.refresh)
router.get('/', userController.getAll)
router.get('/:id', userController.getOne)

module.exports = router
