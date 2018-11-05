const meta = require('./meta')
const score = require('./score')

const splitSus = sus => {
  const validLines = sus.split('\n').filter(line => line.slice(0,1) === "#").map(line => line.slice(1))

  const data = {}

  data.BPMs = validLines.filter(line => line.match(/^\d{3}08:/))
    .map(line => ({measure: Number(line.slice(0,3)), defnum: Number(line.split(':')[1].trim())}))
    .sort((a,b) => a.measure < b.measure ? -1 : a.measure > b.measure ? 1 : 0)

  data.BEATs = validLines.filter(line => line.match(/^\d{3}02:/))
    .map(line => ({measure: Number(line.slice(0,3)), beat: Number(line.split(':')[1].trim())}) )
    .sort((a,b) => a.measure < b.measure ? -1 : a.measure > b.measure ? 1 : 0)

  data.shortNoteLines = validLines.filter(line => line.match(/^\d{3}[15][0-9A-F]:/))
    .map(line => ({measure: Number(line.slice(0,3)), type: line.slice(3,4), lane: parseInt(line.slice(4,5), 16), data: line.split(':')[1].trim()  }))
    .sort((a,b) => a.measure < b.measure ? -1 : a.measure > b.measure ? 1 : 0)

  data.longNoteLines = validLines.filter(line => line.match(/^\d{3}[2-4][0-9A-F][0-9A-Z]:/))
    .map(line => ({measure: Number(line.slice(0,3)), type: line.slice(3,4), lane: parseInt(line.slice(4,5), 16), id: parseInt(line.slice(5,6), 36), data: line.split(':')[1].trim()  }))
    .sort((a,b) => a.measure < b.measure ? -1 : a.measure > b.measure ? 1 : 0)

  return data
}

module.exports = {
  getMeta: sus => {
    splitSus(sus)
    return meta.getMeta(sus)
  },
  getData: sus => {

  },
  validate: sus => {
    return meta.validate(sus)
  }
}


// susをmetaとdataに分割
