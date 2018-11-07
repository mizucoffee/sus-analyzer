const meta = require('./meta')
const score = require('./score')

module.exports = {
  getMeta: sus => meta.getMeta(sus),
  getData: sus => score.analyze(sus),
  validate: sus => meta.validate(sus)
}
