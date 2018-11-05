const meta = require('./meta')
const score = require('./score')
const image = require('./image')

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
    .map(line => {
      let l = {}
      l.measure = Number(line.slice(0,3))
      l.type = line.slice(3,4)
      l.lane = parseInt(line.slice(4,5), 16)
      const data = line.split(':')[1].trim()
      l.split = data.length / 2
      l.data = []
      for (let i = 0; i < data.length; i++) {
        l.data.push({pos: i,type: data[i*2], width: parseInt(data[i*2+1], 17) - 1})
      }
      return l
    })
    .sort((a,b) => a.measure < b.measure ? -1 : a.measure > b.measure ? 1 : 0)

  data.longNoteLines = validLines.filter(line => line.match(/^\d{3}[2-4][0-9A-F][0-9A-Z]:/))
    .map(line => {
      let l = {}
      l.measure = Number(line.slice(0,3))
      l.type = line.slice(3,4)
      l.lane = parseInt(line.slice(4,5), 16)
      const data = line.split(':')[1].trim()
      l.split = data.length / 2
      l.id = parseInt(line.slice(5,6), 36)
      l.data = []
      for (let i = 0; i < data.length; i++) {
        l.data.push({pos: i,type: data[i*2], width: parseInt(data[i*2+1], 17) - 1})
      }
      return l
    })
    .sort((a,b) => a.measure < b.measure ? -1 : a.measure > b.measure ? 1 : 0)

  data.measure = data.shortNoteLines.concat(data.longNoteLines).reduce((a,b) => a.measure > b.measure ? a.measure : b.measure) + 1

  return data
}

module.exports = {
  getMeta: sus => {
    return meta.getMeta(sus)
  },
  getData: sus => {
    return splitSus(sus)
  },
  validate: sus => {
    return meta.validate(sus)
  },
  getImage: sus => {
    return image(splitSus(sus))
  }
}


// susをmetaとdataに分割
