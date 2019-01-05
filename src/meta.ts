export interface ISusDifficulty {
  TEXT: string
  COLOR: string
  BACKGROUND: string
  LEVEL: number
  MARK?: string
}

export interface ISusLevel {
  LEVEL: number
  TEXT: string
  PLUS: boolean
}

export interface ISusMeta {
  ARTIST?: string
  BACKGROUND?: string
  BASEBPM?: number
  DESIGNER?: string
  DIFFICULTY?: ISusDifficulty
  JACKET?: string
  MOVIE?: string
  MOVIEOFFSET?: number
  PLAYLEVEL?: ISusLevel
  SONGID?: string
  TITLE?: string
  WAVE?: string
  WAVEOFFSET?: number
}

export interface ISusValidity {
  VALIDITY: boolean
  MISSING_META: string[]
}

const difficultys = [
  { TEXT: 'BASIC', COLOR: '#19aa19', BACKGROUND: '#e8f6e8' },
  { TEXT: 'ADVANCED', COLOR: '#f55000', BACKGROUND: '#feede5' },
  { TEXT: 'EXPERT', COLOR: '#a00a50', BACKGROUND: '#F5E6ED' },
  { TEXT: 'MASTER', COLOR: '#8200dc', BACKGROUND: '#f2e5fb' },
  { TEXT: "WORLD'S END", COLOR: '#000000', BACKGROUND: '#e5e5e5' }
]

const SupportMeta = [
  'SONGID',
  'TITLE',
  'ARTIST',
  'DESIGNER',
  'DIFFICULTY',
  'PLAYLEVEL',
  'WAVE',
  'WAVEOFFSET',
  'JACKET',
  'BACKGROUND',
  'MOVIE',
  'MOVIEOFFSET',
  'BASEBPM'
]

const RequiredMeta: string[] = [
  'SONGID',
  'TITLE',
  'ARTIST',
  'DESIGNER',
  'DIFFICULTY',
  'PLAYLEVEL'
]

/**
 * メタデータのオブジェクトを返す関数
 * @param {String} sus - sus
 * @return {ISusMeta} メタデータ
 */
export function getMeta(sus: string): ISusMeta {
  return getValidMetaLines(sus).reduce(
    (obj: ISusMeta, line: string[]) => {
      switch (line[0]) {
        case 'ARTIST':
          obj.ARTIST = line[1]
          break
        case 'BACKGROUND':
          obj.BACKGROUND = line[1]
          break
        case 'BASEBPM':
          if (!isNaN(Number(line[1]))) {
            obj.BASEBPM = Number(line[1])
          }
          break
        case 'DESIGNER':
          obj.DESIGNER = line[1]
          break
        case 'DIFFICULTY':
          const difLevel = Number(line[1].slice(0, 1))
          if (isNaN(difLevel)) {
            break
          }
          if (0 > Number(difLevel) || Number(difLevel) > 4) {
            break
          }
          const data: ISusDifficulty = {
            BACKGROUND: difficultys[difLevel].BACKGROUND,
            COLOR: difficultys[difLevel].COLOR,
            LEVEL: Number(difLevel),
            TEXT: difficultys[difLevel].TEXT
          }
          if (data.LEVEL === 4) {
            data.MARK = line[1].length !== 1 ? `${line[1]}:`.split(':')[1] : ''
          }
          obj.DIFFICULTY = data
          break
        case 'JACKET':
          obj.JACKET = line[1]
          break
        case 'MOVIE':
          obj.MOVIE = line[1]
          break
        case 'MOVIEOFFSET':
          if (!isNaN(Number(line[1]))) {
            obj.MOVIEOFFSET = Number(line[1])
          }
          break
        case 'PLAYLEVEL':
          const plus = line[1].slice(-1) === '+'
          if (line[1].slice(-1) === '+') {
            line[1] = line[1].slice(0, -1)
          }
          if (isNaN(Number(line[1]))) {
            break
          }
          const playLevel: ISusLevel = {
            LEVEL: Number(line[1]),
            PLUS: plus,
            TEXT: `${Number(line[1])}${plus ? '+' : ''}`
          }
          obj.PLAYLEVEL = playLevel
          break
        case 'SONGID':
          obj.SONGID = line[1]
          break
        case 'TITLE':
          obj.TITLE = line[1]
          break
        case 'WAVE':
          obj.WAVE = line[1]
          break
        case 'WAVEOFFSET':
          if (!isNaN(Number(line[1]))) {
            obj.WAVEOFFSET = Number(line[1])
          }
          break
      }
      return obj
    },
    {} as ISusMeta
  )
}

/**
 * sus譜面が有効かどうかを返す関数
 * @param {String} sus - sus
 * @return {ISusValidity} 結果
 */
export function validate(sus: string) {
  const meta = getMeta(sus)

  const required = RequiredMeta.slice()
  if (meta.WAVE != null) {
    required.push('WAVEOFFSET')
  }
  if (meta.MOVIE != null) {
    required.push('MOVIEOFFSET')
  }
  if (meta.DIFFICULTY != null && meta.DIFFICULTY.LEVEL === 4) {
    required.splice(required.indexOf('PLAYLEVEL'), 1)
  }
  const missingMeta = required.filter(line => !meta.hasOwnProperty(line))

  const validity: ISusValidity = {
    MISSING_META: missingMeta,
    VALIDITY: missingMeta.length === 0
  }
  return validity
}

/**
 * sus文字列から有効行を配列で返す関数
 * @param {String} sus - sus
 * @return {string[][]} sus有効行の配列
 */
function getValidMetaLines(sus: string): string[][] {
  return sus
    .split('\n')
    .filter(line => line.slice(0, 1) === '#') // sus有効行
    .map(line => line.slice(1)) // #除去
    .filter(line => !Number.isFinite(Number(line.slice(0, 3)))) // 上3桁が数字(譜面データ)除外
    .map(line => [
      line
        .slice(0, line.indexOf(' '))
        .trim()
        .toUpperCase(),
      line.slice(line.indexOf(' ') + 1, line.length).trim()
    ])
    .filter(line => SupportMeta.indexOf(line[0]) > -1) // 非対応メタデータ除外
    .map(line => {
      if (
        line[1].slice(0, 1) === '"' &&
        line[1].slice(line[1].length - 1) === '"'
      ) {
        line[1] = line[1].slice(1, line[1].length - 1)
      }
      return line
    }) // 文字列リテラルの
    .filter(line => line[1])
}
