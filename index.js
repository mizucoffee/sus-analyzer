const difficultys = {
  0: {
    TEXT :"BASIC",
    COLOR :"#19aa19",
    BACKGROUND :"#e8f6e8"
  },
  1: {
    TEXT :"ADVANCED",
    COLOR :"#f55000",
    BACKGROUND :"#feede5"
  },
  2: {
    TEXT :"EXPERT",
    COLOR :"#a00a50",
    BACKGROUND :"#F5E6ED"
  },
  3: {
    TEXT :"MASTER",
    COLOR :"#8200dc",
    BACKGROUND :"#f2e5fb"
  },
  4: {
    TEXT :"WORLD'S END",
    COLOR :"#000000",
    BACKGROUND :"#e5e5e5"
  }
}

const base = {
  SONGID: "",
  TITLE: "",
  ARTIST: "",
  DESIGNER: "",
  DIFFICULTY: {LEVEL: -1,STAR: "",MARK: ""},
  PLAYLEVEL: {LEVEL: 0, PLUS:0 },
  WAVE: "",
  WAVEOFFSET: 0,
  JACKET: "",
  BACKGROUND: "",
  MOVIE: "",
  MOVIEOFFSET: 0,
  BASEBPM: 0
}

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
  "PLAYLEVEL"
]

function susToArray(sus) {
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
      let data = line[1]
      switch(line[0]) {
        case "DIFFICULTY":
          line[1] = {}
          if(isFinite(data.slice(0,1))) {
            line[1].LEVEL = Number(data.slice(0,1))
            if(0 >= line[1].LEVEL) line[1].LEVEL = 0
            if(4 < line[1].LEVEL) line[1].LEVEL = 4
            line[1] = Object.assign(line[1], difficultys[line[1].LEVEL])
            if(line[1].LEVEL !== 4) break
            if(data.length === 1) break
            line[1].STAR = data.slice(1).split("☆").length - 1
            line[1].MARK = data.slice(data.length-1)
          } else {
            line[1].LEVEL = 4
            line[1] = Object.assign(line[1], difficultys[line[1].LEVEL])
            if(data.length === 1) break
            line[1].STAR = data.slice(1).split("☆").length- 1
            line[1].MARK = data.slice(0,1)
          }
          break
        case "WAVEOFFSET":
        case "MOVIEOFFSET":
        case "BASEBPM":
          if(!isFinite(line[1])) return []
          line[1] = Number(line[1])
          break
        case "PLAYLEVEL":
          line[1] = {}
          if (data.slice(-1) === '+') {
            line[1].PLUS = 1
            data = data.slice(0,-1)
          }

          if(!isFinite(data)) return []
          line[1].LEVEL = Number(data)
          line[1].TEXT = `${line[1].LEVEL}${line[1].PLUS ? "+" : ""}`
          break
      }
      return line
    })
}

module.exports = {
  getMeta: sus => {
    const metaObj = Object.assign({}, base)
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
