const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const auth = require('../middleware/authMiddleware')
const admin = require('../middleware/checkRole')

router.post('/login', userController.login)
router.post('/registration', userController.registration)
router.post('/logout', userController.logout)
router.post('/:id/upload/avatar/', auth, userController.avatar)
router.post('/:id/remove/avatar/:avatar', auth, userController.removeAvatar)
router.post('/:id/remove', auth, admin, userController.removeUser)
router.post('/:id/update', auth, userController.updateUser)
router.get('/refresh', userController.refresh)
router.get('/', auth, userController.getAll)
router.get('/:id', auth, userController.getOne)

module.exports = router
