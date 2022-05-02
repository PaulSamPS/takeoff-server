const { Level } = require('../models/models')
const ApiError = require('../error/ApiError')

class PositionController {
  async append(req, res, next) {
    const { name } = req.body
    const levelName = await Level.findOne({ where: { name } })
    if (levelName) {
      return next(ApiError.internal('Уровень с таким названием уже существует'))
    }
    const level = await Level.create({ name })
    return res.json({ level })
  }

  async getAll(req, res) {
    const level = await Level.findAll()
    return res.json(level)
  }
}

module.exports = new PositionController()
