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
 * @param {string[]} validLine - sus有効行配列
 * @param {number} measure - 譜面小節数
 * @param {number} [basebpm=120] - 譜面BASEBPM
 * @return {number[]} BPMs[<小節番号>] = 小節のBPM
 */
function getBPMs(
  validLines: string[],
  mea: number,
  basebpm: number = 120
): number[] {
  const bpmList = lineToDef(validLines, /^BPM\d{2}:/, 3, 5)
  const bpmDef = lineToDef(validLines, /^\d{3}08:/, 0, 3).map(def => {
    if (!bpmList[def]) {
      return undefined
    }
    return bpmList[def]
  })
  bpmDef[0] = !Number(bpmDef[0]) ? basebpm : bpmDef[0]
  return defToArray(bpmDef, mea)
}

/**
 * 小節あたりの拍数を配列に変換する関数
 * @param {string[]} validLine - sus有効行配列
 * @param {number} measure - 譜面小節数
 * @return {number[]} BEATs[<小節番号>] = 小節の拍数
 */
function getBEATs(validLines: string[], measure: number): number[] {
  const beatDef = lineToDef(validLines, /^\d{3}02:/, 0, 3)
  beatDef[0] = !Number.isFinite(beatDef[0]) ? 4 : beatDef[0]
  return defToArray(beatDef, measure)
}

function lineToDef(
  validLines: string[],
  pattern: RegExp,
  s1: number,
  s2: number
) {
  return validLines
    .filter(line => line.match(pattern))
    .reduce(
      (list, line) => {
        list[Number(line.slice(s1, s2))] = Number(line.split(':')[1].trim())
        return list
      },
      [] as number[]
    )
}

function defToArray(def: Array<number | undefined>, measure: number) {
  return [...Array(measure)].reduce((list, _, index) => {
    let i = index
    do {
      list[index] = def[i--]
    } while (typeof list[index] === 'undefined')
    return list
  }, [])
}

/**
 * sus有効行からノーツオブジェクトに変換する関数
 * @param {string[]} validLine - sus有効行配列
 * @param {number} tpb - Tick辺りの拍数
 * @param {number[]} beats - 拍数の配列
 * @return {ISusMeta[]} BEATs[<小節番号>] = 小節の拍数
 */
function getNotes(
  validLines: string[],
  tpb: number,
  beats: number[]
): ISusNotes[] {
  return validLines
    .filter(line =>
      line.match(
        /^\d{3}[1-5][0-9a-fA-F][0-9a-zA-Z]?:(\s*[0-9a-zA-Z][0-9a-gA-G])+\s*$/
      )
    )
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
 * @param {ISusNotes[]} notes - ノーツ配列
 * @param {number} laneType - ロング種別
 * @return {ISusNotes[][]} ロングオブジェクトの配列
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
              if (note.channel && longs[lane] && longs[lane][note.channel]) {
                longs[lane][note.channel].push(note)
                list.push(longs[lane][note.channel])
                delete longs[lane][note.channel]
              }
            })
          notesPerTick
            .filter(note => note.noteType === 1)
            .forEach(note => {
              const lane = laneType === 2 ? note.lane : 0
              if (note.channel) {
                longs[lane] = longs[lane] || []
                longs[lane][note.channel] = []
                longs[lane][note.channel].push(note)
              }
            })
          notesPerTick
            .filter(note => [3, 4, 5].indexOf(note.noteType) > -1)
            .forEach(note => {
              const lane = laneType === 2 ? note.lane : 0
              if (note.channel && longs[lane] && longs[lane][note.channel]) {
                longs[lane][note.channel].push(note)
              }
            })
        })
        return list
      },
      [] as ISusNotes[][]
    )
}

/**
 * susを解析する関数
 * @param {String} sus - sus文字列
 * @param {Number} [tickPerBeat=192] - TickPerBeat
 * @return {ISusScore} 譜面
 */
export function getScore(sus: string, tickPerBeat: number = 192): ISusScore {
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
