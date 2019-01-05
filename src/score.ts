import * as meta from './meta'

export interface ISusNotes {
  channel?: number
  lane: number
  laneType: number
  measure: number
  noteType: number
  tick: number
  width: number
}

export interface ISusScore {
  measure: number
  BPMs: number[]
  BEATs: number[]
  shortNotes: ISusNotes[]
  holdNotes: ISusNotes[][]
  slideNotes: ISusNotes[][]
  airActionNotes: ISusNotes[][]
  airNotes: ISusNotes[]
}

/**
 * 小節あたりのBPMを配列に変換する関数
 * @param {string[]} validLine - sus有効行
 * @param {number} measure - 譜面の小節数
 * @param {number} basebpm - 譜面のBASEBPM
 * @return 配列[小節番号] = BPM
 */
function getBPMs(
  validLines: string[],
  measure: number,
  basebpm?: number
): number[] {
  const bpmList = validLines
    .filter(line => line.match(/^BPM\d{2}:/))
    .reduce(
      (list, line) => {
        list[Number(line.slice(3, 5))] = Number(line.split(':')[1].trim())
        return list
      },
      [] as number[]
    )

  const bpmDef = validLines
    .filter(line => line.match(/^\d{3}08/))
    .reduce(
      (list, line) => {
        list[Number(line.slice(0, 3))] =
          bpmList[Number(line.split(':')[1].trim())] || basebpm || 120
        return list
      },
      [] as number[]
    )

  if (bpmDef.length === 0 || !Number.isFinite(bpmDef[0])) {
    bpmDef[0] = basebpm || 120
  }

  return [...Array(measure)].reduce((list, _, index) => {
    let i = index
    do {
      list[index] = bpmDef[i--]
    } while (typeof list[index] === 'undefined')
    return list
  }, [])
}

/**
 * 小節あたりの拍数を配列に変換する関数
 * @param {string[]} validLine - sus有効行
 * @param {number} measure - 譜面の小節数
 * @return 配列[小節番号] = BEAT
 */
function getBEATs(validLines: string[], measure: number): number[] {
  const beatDef = validLines
    .filter(line => line.match(/^\d{3}02:/))
    .reduce(
      (list, line) => {
        list[Number(line.slice(0, 3))] = Number(line.split(':')[1].trim())
        return list
      },
      [] as number[]
    )

  if (beatDef.length === 0 || !Number.isFinite(beatDef[0])) {
    beatDef[0] = 4
  }

  return [...Array(measure)].reduce((list, _, index) => {
    let i = index
    do {
      list[index] = beatDef[i--]
    } while (typeof list[index] === 'undefined')
    return list
  }, [])
}

const NotesRegexp = /^\d{3}[1-5][0-9a-fA-F][0-9a-zA-Z]?:(\s*[0-9a-zA-Z][0-9a-gA-G])+\s*$/

function getNotes(
  validLines: string[],
  tpb: number,
  beats: number[]
): ISusNotes[] {
  return validLines
    .filter(line => line.match(NotesRegexp))
    .map(line => line.split(':', 2))
    .reduce(
      (list, line) => {
        const data = line[1].trim().replace(/ /g, '')
        const measure = Number(line[0].slice(0, 3))
        ;[...Array(data.length / 2)]
          .map((_, i) => {
            const n: ISusNotes = {
              lane: parseInt(line[0].slice(4, 5), 16),
              laneType: Number(line[0].slice(3, 4)),
              measure,
              noteType: parseInt(data[i * 2], 36),
              tick: Math.round(
                ((tpb * beats[measure]) / (data.length / 2)) * i
              ),
              width: parseInt(data[i * 2 + 1], 17)
            }
            if (line[0].length === 6) {
              n.channel = line[0]
                .slice(5, 6)
                .toUpperCase()
                .charCodeAt(0)
            }
            return n
          })
          .filter(note => note.width !== 0)
          .forEach(note => list.push(note))
        return list
      },
      [] as ISusNotes[]
    )
}

/**
 * ノーツからロングオブジェクトに変換する関数
 * @param {Object} notes - ノーツ配列
 * @param {number} laneType - ロング種別
 * @return ロングオブジェクトの配列
 */
function getLongLane(notes: ISusNotes[], laneType: number): ISusNotes[][] {
  const longs: ISusNotes[][][] = []
  return notes
    .filter(note => note.laneType === laneType)
    .reduce(
      (list, note) => {
        list[note.measure] = list[note.measure] || []
        list[note.measure][note.tick] = list[note.measure][note.tick] || []
        list[note.measure][note.tick].push(note)
        return list
      },
      [] as ISusNotes[][][] // [measure][tick][notes]
    )
    .reduce(
      (list, measure) => {
        measure.forEach(notesPerTick => {
          notesPerTick
            .filter(note => note.noteType === 2)
            .forEach(note => {
              const lane = laneType === 2 ? note.lane : 0
              if (
                note.channel == null ||
                longs[lane] == null ||
                longs[lane][note.channel] == null
              ) {
                return
              }
              longs[lane][note.channel].push(note)
              list.push(longs[lane][note.channel])
              delete longs[lane][note.channel]
            })
          notesPerTick
            .filter(note => note.noteType === 1)
            .forEach(note => {
              const lane = laneType === 2 ? note.lane : 0
              if (note.channel == null) {
                return
              }

              longs[lane] = longs[lane] || []
              longs[lane][note.channel] = []
              longs[lane][note.channel].push(note)
            })
          notesPerTick
            .filter(note => [3, 4, 5].indexOf(note.noteType) > -1)
            .forEach(note => {
              const lane = laneType === 2 ? note.lane : 0
              if (
                note.channel == null ||
                longs[lane] == null ||
                longs[lane][note.channel] == null
              ) {
                return
              }
              longs[lane][note.channel].push(note)
            })
        })
        return list
      },
      [] as ISusNotes[][]
    )
}

/**
 * susを解析する関数
 * @param {String} sus - sus
 * @param {Number} tickPerBeat - デフォルト値: 192
 * @return { measure: <小節数>, BPMs: [<BPMの配列>], BEATs: [拍数の配列], shortNotes: [{ measure: <小節番号>, lane_type: <レーン種別>, lane: <レーン番号>, note_type: <ノーツ種別>, position: <小節内のTick>, width: <ノーツ幅>}], longNotes: [{type: <レーン種別>, notes: [ measure: <小節番号>, lane_type: <レーン種別>, lane: <レーン番号>, defnum: <識別番号>, note_type: ノーツ種別, position: <小節内のTick>, width: <ノーツ幅> ]}]}
 */
export function analyze(sus: string, tickPerBeat: number = 192): ISusScore {
  const validLines = sus
    .split('\n')
    .filter(line => line.slice(0, 1) === '#')
    .map(line => line.slice(1))

  const measure =
    validLines
      .filter(line => line.match(/^\d{3}[1-5][0-9a-fA-F][0-9a-zA-Z]?:/))
      .map(line => Number(line.slice(0, 3)))
      .reduce((a, b) => (a > b ? a : b), 0) + 1

  const BEATs = getBEATs(validLines, measure)

  const notes: ISusNotes[] = getNotes(validLines, tickPerBeat, BEATs)
  const score: ISusScore = {
    BEATs,
    BPMs: getBPMs(validLines, measure, meta.getMeta(sus).BASEBPM),
    airActionNotes: getLongLane(notes, 4),
    airNotes: notes.filter(note => note.laneType === 5),
    holdNotes: getLongLane(notes, 2),
    measure,
    shortNotes: notes.filter(note => note.laneType === 1),
    slideNotes: getLongLane(notes, 3)
  }

  return score
}
