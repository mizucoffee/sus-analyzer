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
      list[Number(line.slice(3, 5))] = Number(line.split(':')[1].trim())
      return list
    }, [])

  const bpmDef = validLines
    .filter(line => line.match(/^\d{3}08/))
    .reduce((list, line) => {
      list[Number(line.slice(0, 3))] =
        bpmList[Number(line.split(':')[1].trim())] || basebpm || 120
      return list
    }, [])

  if (bpmDef.length == 0 || !Number.isFinite(bpmDef[0]))
    bpmDef[0] = basebpm || 120

  return [...Array(measure)].reduce((list, line, index) => {
    let i = index
    while (typeof (list[index] = bpmDef[i--]) === 'undefined');
    return list
  }, [])
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
      list[Number(line.slice(0, 3))] = Number(line.split(':')[1].trim())
      return list
    }, [])

  if (beatDef.length == 0 || !Number.isFinite(beatDef[0])) beatDef[0] = 4

  return [...Array(measure)].reduce((list, line, index) => {
    let i = index
    while (typeof (list[index] = beatDef[i--]) === 'undefined');
    return list
  }, [])
}

function getNotes(validLines, tpb, beats) {
  return validLines
    .filter(line =>
      line.match(
        /^\d{3}[1-5][0-9a-fA-F][0-9a-zA-Z]?:(\s*[0-9a-zA-Z][0-9a-gA-G])+\s*$/
      )
    )
    .map(line => line.split(':', 2))
    .map(line => {
      const data = {
        measure: Number(line[0].slice(0, 3)),
        lane_type: Number(line[0].slice(3, 4)),
        lane: parseInt(line[0].slice(4, 5), 16),
        data: line[1].trim().replace(/ /g, ''),
      }
      if (line[0].length === 6) data.channel = line[0].slice(5, 6)
      return data
    })
    .reduce((list, line) => {
      ;[...Array(line.data.length / 2)]
        .map((note, i) => `${line.data[i * 2]}${line.data[i * 2 + 1]}`)
        .map((note, i) => ({
          ...line,
          tick: Math.round(
            ((tpb * beats[line.measure]) / (line.data.length / 2)) * i
          ),
          note_type: parseInt(note[0], 36),
          width: parseInt(note[1], 17),
        }))
        .filter(note => note.width !== 0)
        .map(note => {
          delete note.data
          return note
        })
        .forEach(e => list.push(e))
      return list
    }, [])
}

/**
 * ノーツからロングオブジェクトに変換する関数
 * @param {Object} notes - ノーツ配列
 * @param {number} type - ロング種別
 * @return ロングオブジェクトの配列
 */
function getLongLane(notes, type) {
  let longs = {}
  return notes
    .filter(note => note.lane_type === type)
    .reduce((list, line) => {
      list[line.measure] = list[line.measure] || []
      list[line.measure][line.tick] = list[line.measure][line.tick] || []
      list[line.measure][line.tick].push(line)
      return list
    }, [])
    .reduce((list, measure) => {
      measure.forEach(notesPerTick => {
        ;[[2], [1], [3, 4, 5]].forEach(type => {
          notesPerTick
            .filter(note => type.includes(note.note_type))
            .forEach(note => {
              const lane = note.lane_type == 2 ? note.lane : 0
              if ([2, 3, 4, 5].includes(note.note_type)) {
                if (
                  !longs.hasOwnProperty(lane) ||
                  !longs[lane].hasOwnProperty(note.defnum)
                ) {
                  return
                }
                if ([3, 4, 5].includes(note.note_type)) {
                  longs[lane][note.defnum].notes.push(note)
                }
                if (2 == note.note_type) {
                  longs[lane][note.defnum].notes.push(note)
                  list.push(longs[lane][note.defnum])
                  delete longs[lane][note.defnum]
                }
              }
              if (1 == note.note_type) {
                longs[lane] = {}
                longs[lane][note.defnum] = {
                  type: note.lane_type,
                  notes: [],
                }
                longs[lane][note.defnum].notes.push(note)
              }
            })
        })
      })
      return list
    }, [])
}

/**
 * susを解析する関数
 * @param {String} sus - sus
 * @param {Number} tickPerBeat - デフォルト値: 192
 * @return { measure: <小節数>, BPMs: [<BPMの配列>], BEATs: [拍数の配列], shortNotes: [{ measure: <小節番号>, lane_type: <レーン種別>, lane: <レーン番号>, note_type: <ノーツ種別>, position: <小節内のTick>, width: <ノーツ幅>}], longNotes: [{type: <レーン種別>, notes: [ measure: <小節番号>, lane_type: <レーン種別>, lane: <レーン番号>, defnum: <識別番号>, note_type: ノーツ種別, position: <小節内のTick>, width: <ノーツ幅> ]}]}
 */
function analyze(sus, tickPerBeat = 192) {
  const validLines = sus
    .split('\n')
    .filter(line => line.slice(0, 1) === '#')
    .map(line => line.slice(1))
  const score = {}

  score.measure =
    validLines
      .filter(line => line.match(/^\d{3}[1-5][0-9a-fA-F][0-9a-zA-Z]?:/))
      .map(line => Number(line.slice(0, 3)))
      .reduce((a, b) => (a > b ? a : b), 0) + 1

  score.BPMs = getBPMs(validLines, score.measure, meta.getMeta(sus).BASEBPM)
  score.BEATs = getBEATs(validLines, score.measure)

  const notes = getNotes(validLines, tickPerBeat, score.BEATs)

  score.shortNotes = notes.filter(note => note.lane_type === 1)
  score.holdNotes = getLongLane(notes, 2)
  score.slideNotes = getLongLane(notes, 3)
  score.airActionNotes = getLongLane(notes, 4)
  score.airNotes = notes.filter(note => note.lane_type === 5)

  return score
}

module.exports = {
  analyze: analyze,
}
