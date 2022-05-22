const Level = require('../models/levelModel')
const ApiError = require('../error/ApiError')

class LevelController {
  async append(req, res, next) {
    const { name } = req.body
    const levelName = await Level.findOne({ name })
    if (levelName) {
      return next(ApiError.internal('Уровень с таким названием уже существует'))
    }
    const level = await Level.create({ name })
    return res.json({ level })
  }

  async getAll(req, res) {
    const level = await Level.find()
    return res.json(level)
  }
}

module.exports = new LevelController()
