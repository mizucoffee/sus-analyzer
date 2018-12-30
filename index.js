const meta = require('./meta')
const score = require('./score')

module.exports = {
  getMeta: meta.getMeta,
  getScore: score.analyze,
  validate: meta.validate,
}
