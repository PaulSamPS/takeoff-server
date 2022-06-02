const Position = require('../models/position.model')
const ApiError = require('../error/api.error')

class PositionController {
  async append(req, res, next) {
    const { name } = req.body
    const positionName = await Position.findOne({ name })
    if (positionName) {
      return next(ApiError.internal('Позиция с таким названием уже существует'))
    }
    const position = await Position.create({ name })
    return res.json({ position })
  }

  async getAll(req, res) {
    const position = await Position.find()
    return res.json(position)
  }
}

module.exports = new PositionController()
