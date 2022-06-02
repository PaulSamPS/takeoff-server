const Router = require('express')
const router = new Router()
const positionController = require('../controllers/position.controller')

router.post('/append', positionController.append)
router.get('/', positionController.getAll)

module.exports = router
