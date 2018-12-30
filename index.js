const meta = require('./meta')
const score = require('./score')

module.exports = {
  getMeta: meta.getMeta,
  getData: score.analyze,
  validate: meta.validate,
}
