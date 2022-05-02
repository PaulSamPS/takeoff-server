const Router = require('express')
const router = new Router()
const levelController = require('../controllers/levelController')

router.post('/append', levelController.append)
router.get('/', levelController.getAll)

module.exports = router
