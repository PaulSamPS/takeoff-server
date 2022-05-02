const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')

router.post('/login', userController.login)
router.post('/registration', userController.registration)
router.post('/logout', userController.logout)
router.get('/refresh', userController.refresh)
router.get('/', userController.getAll)
router.get('/:id', userController.getOne)

module.exports = router
