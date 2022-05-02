const Router = require('express')
const router = new Router()
const positionController = require('../controllers/positionController')

router.post('/append', positionController.append)
router.get('/', positionController.getAll)

module.exports = router
