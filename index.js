const support_meta = [
  "SONGID",
  "TITLE",
  "ARTIST",
  "DESIGNER",
  "DIFFICULTY",
  "PLAYLEVEL",
  "WAVE",
  "WAVEOFFSET",
  "JACKET",
  "BACKGROUND",
  "MOVIE",
  "MOVIEOFFSET",
  "BASEBPM"
]

const required_meta = [
  "SONGID",
  "TITLE",
  "ARTIST",
  "DESIGNER",
  "DIFFICULTY",
  "PLAYLEVEL",
  "WAVE",
  "WAVEOFFSET",
  "BASEBPM"
]

function susToArray(sus) {
  if(!sus) throw new Error("Argument required");
   return sus.split('\n')
    .filter(line => line)
    .filter(line => line.slice(0,1) === "#")
    .map(line => line.slice(1))
    .filter(line => !isFinite(line.slice(0,3)))
    .map(line => {
      const s = line.indexOf(' ')
      const a = []
      a[0] = line.slice(0,s)
      a[1] = line.slice(s+1,line.length)
      return a
    })
    .map(line => { line[0] = line[0].trim(); return line})
    .map(line => { line[1] = line[1].trim(); return line})
    .filter(line => support_meta.indexOf(line[0]) >= 0)
    .map(line => { if(line[1].slice(0,1) == '"' && line[1].slice(line[1].length-1) == '"') line[1] = line[1].slice(1,line[1].length-1);return line})
    .map(line => {
      switch(line[0]) {
        case "DIFFICULTY":
          const data = line[1]
          line[1] = {}
          if(isFinite(data.slice(0,1))) {
            line[1].LEVEL = Number(data.slice(0,1))
            if(0 > line[1].LEVEL) line[1].LEVEL = 0
            if(4 < line[1].LEVEL) line[1].LEVEL = 4
            if(line[1].LEVEL !== 4) break
            if(data.length === 1) break
            line[1].STAR = data.slice(1).split("☆").length - 1
            line[1].MARK = data.slice(data.length-1)

          } else {
            line[1].LEVEL = 4
            if(data.length === 1) break
            line[1].MARK = data.slice(0,1)
            line[1].STAR = data.slice(1).split("☆").length- 1
          }
          break
        case "PLAYLEVEL":
        case "WAVEOFFSET":
        case "MOVIEOFFSET":
        case "BASEBPM":
          if(!isFinite(line[1])) return []
          line[1] = Number(line[1])
          break
      }
      return line
    })
}

module.exports = {
  getMeta: sus => {
    const metaObj = {}
    susToArray(sus).forEach(line => metaObj[line[0]] = line[1])
    return metaObj
  },
  validate: sus => {
    const returnObj = {}
    const array = susToArray(sus).map(line => line[0])
    let missing_meta = required_meta.filter(line => array.indexOf(line) === -1)
    returnObj.VALIDITY = missing_meta.length === 0
    returnObj.MISSING_META = missing_meta
    return returnObj
  }
}
