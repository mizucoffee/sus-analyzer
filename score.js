const meta = require('./meta')

/**
 * 小節あたりのBPMを配列に変換する関数
 * @param {Object} validLine - sus有効行
 * @param {number} measure - 譜面の小節数
 * @param {number} basebpm - 譜面のBASEBPM
 * @return 配列[小節番号] = BPM
 */
function getBPMs(validLines, measure, basebpm) {
  const bpmList = validLines
    .filter(line => line.match(/^BPM\d{2}:/))
    .reduce((list, line) => {
      list[Number(line.slice(3,5))] = Number(line.split(':')[1].trim())
      return list
    },[])

  const bpmDef = validLines
    .filter(line => line.match(/^\d{3}08/))
    .reduce((list, line) => {
      list[Number(line.slice(0,3))] = bpmList[Number(line.split(' ')[1].trim())] || basebpm ||120
      return list
    },[])

  if(bpmDef.length == 0 || !Number.isFinite(bpmDef[0])) bpmDef[0] = basebpm || 120

  return [...Array(measure)].reduce((list, line, index) => {
    let i = index
    while(typeof (list[index] = bpmDef[i--]) === "undefined");
    return list
  },[])
}

/**
 * 小節あたりの拍数を配列に変換する関数
 * @param {Object} validLine - sus有効行
 * @param {number} measure - 譜面の小節数
 * @return 配列[小節番号] = BEAT
 */
function getBEATs(validLines, measure) {
  const beatDef = validLines
    .filter(line => line.match(/^\d{3}02:/))
    .reduce((list, line) => {
      list[Number(line.slice(0,3))] = Number(line.split(':')[1].trim())
      return list
    },[])

  if(beatDef.length == 0 || !Number.isFinite(beatDef[0])) beatDef[0] = 4

  return [...Array(measure)].reduce((list, line, index) => {
    let i = index
    while(typeof (list[index] = beatDef[i--]) === "undefined");
    return list
  },[])
}

/**
 * susを解析する関数
 * @param {String} sus - sus
 * @return { measure: <小節数>, BPMs: [<BPMの配列>], BEATs: [拍数の配列], shortNotes: [{ measure: <小節番号>, lane_type: <レーン種別>, lane: <レーン番号>, note_type: <ノーツ種別>, position: <小節内のTick>, width: <ノーツ幅>}], longNotes: [{type: <レーン種別>, notes: [ measure: <小節番号>, lane_type: <レーン種別>, lane: <レーン番号>, defnum: <識別番号>, note_type: ノーツ種別, position: <小節内のTick>, width: <ノーツ幅> ]}]}
 */
function analyze(sus) {
  const validLines = sus.split('\n').filter(line => line.slice(0,1) === "#").map(line => line.slice(1))
  const data = {}

  data.measure = validLines.filter(line => line.match(/^\d{3}[1-5][0-9a-fA-F][0-9a-zA-Z]?:/))
    .map(line => Number(line.slice(0,3)))
    .reduce((a,b) => a > b ? a : b, 0) + 1

  data.BPMs = getBPMs(validLines, data.measure, meta.getMeta(sus).BASEBPM)
  data.BEATs = getBEATs(validLines, data.measure)

  data.shortNotes = validLines
    .filter(line => line.match(/^\d{3}[1|5][0-9a-fA-F]:(\s*[0-9a-zA-Z][0-9a-gA-G])+\s*$/))
    .map(line => ({ measure: Number(line.slice(0,3)), lane_type: Number(line.slice(3,4)), lane: parseInt(line.slice(4,5), 16), data: line.split(':')[1].trim().replace(/ /g,'')}))
    .reduce((list, line) => {
      [...Array(line.data.length / 2)]
        .map((note, i) => `${line.data[i*2]}${line.data[i*2+1]}`)
        .map((note, i) => ({ pos: 192 * data.BEATs[line.measure] / (line.data.length / 2) * i, type: parseInt(note[0], 36), width: parseInt(note[1], 17) }))
        .filter(note => note.width !== 0)
        .map(note => ({ measure: line.measure, lane_type: line.lane_type, lane: line.lane, note_type: note.type, position: note.pos, width: note.width}))
        .forEach(e => list.push(e))
      return list
    },[])

  let longs = {2:{},3:{},4:{}}
  data.longNotes = validLines
    .filter(line => line.match(/^\d{3}[2-4][0-9a-fA-F][0-9a-zA-Z]:(\s*[0-9a-zA-Z][0-9a-gA-G])+\s*$/))
    .map(line => ({measure: Number(line.slice(0,3)), lane_type: Number(line.slice(3,4)), lane: parseInt(line.slice(4,5), 16), defnum: parseInt(line.slice(5,6), 36), data: line.split(':')[1].trim().replace(/ /g,'')}))
    .reduce((list, line) => {
      [...Array(line.data.length / 2)]
        .map((note, i) => `${line.data[i*2]}${line.data[i*2+1]}`)
        .map((note, i) => ({ pos: 192 * data.BEATs[line.measure] / (line.data.length / 2) * i, type: parseInt(note[0], 36), width: parseInt(note[1], 17) }))
        .filter(note => note.width !== 0)
        .map(note => ({ measure: line.measure, lane_type: line.lane_type, lane: line.lane, defnum: line.defnum, note_type: note.type, position: note.pos, width: note.width}))
        .forEach(e => list.push(e))
      return list
    },[])
    .reduce((list, line) => {
      list[line.measure] = list[line.measure] || []
      list[line.measure][line.position] = list[line.measure][line.position] || []
      list[line.measure][line.position].push(line)
      return list
    },[])
    .reduce((list, measure, index) => {
      measure.forEach((notesPerTick,i) => {
        [[2],[3,4,5],[1]].forEach(type => {
          notesPerTick
            .filter(note => type.includes(note.note_type))
            .forEach(note => {
              const lane = note.lane_type == 2 ? note.lane : 0
              switch (note.note_type) {
                  //TODO: 無い時の処理（= d.type == 1が未処理）
                case 1:
                  if(!longs[note.lane_type].hasOwnProperty(lane)) longs[note.lane_type][lane] = {}
                  longs[note.lane_type][lane][note.defnum] = {type: note.lane_type, notes: []}
                  longs[note.lane_type][lane][note.defnum].notes.push(note)
                  break
                case 2:
                  if(!longs[note.lane_type].hasOwnProperty(lane) || !longs[note.lane_type][lane].hasOwnProperty(note.defnum)) break
                  longs[note.lane_type][lane][note.defnum].notes.push(note)
                  list.push(longs[note.lane_type][lane][note.defnum])
                  delete longs[note.lane_type][lane][note.defnum]
                  break
                case 3:
                case 4:
                case 5:
                  if(!longs[note.lane_type].hasOwnProperty(lane) || !longs[note.lane_type][lane].hasOwnProperty(note.defnum)) break
                  longs[note.lane_type][lane][note.defnum].notes.push(note)
                  break
              }
            })
        })
      })
      return list
    },[])

  return data
}

module.exports = {
  analyze: analyze
}
