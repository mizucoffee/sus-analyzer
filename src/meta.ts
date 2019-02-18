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

const MoS: string[] = [
  // Meta of String
  'ARTIST',
  'BACKGROUND',
  'DESIGNER',
  'JACKET',
  'MOVIE',
  'SONGID',
  'TITLE',
  'WAVE'
]

const MoN: string[] = [
  // Meta of Number
  'BASEBPM',
  'MOVIEOFFSET',
  'WAVEOFFSET'
]

/**
 * メタデータのオブジェクトを返す関数
 * @param {String} sus - sus
 * @return {ISusMeta} メタデータ
 */
export function getMeta(sus: string): ISusMeta {
  return getValidMetaLines(sus).reduce(
    (obj: ISusMeta, line: IValidSusLine) => {
      if (MoS.indexOf(line.key) > -1) {
        obj[line.key] = line.value
      }
      if (MoN.indexOf(line.key) > -1 && Number(line.value)) {
        obj[line.key] = Number(line.value)
      }
      if (line.key === 'DIFFICULTY') {
        const difLevel = Number(line.value.slice(0, 1))
        if (isNaN(difLevel) || 0 > Number(difLevel) || Number(difLevel) > 4) {
          return obj
        }
        obj.DIFFICULTY = {
          ...difficultys[difLevel],
          LEVEL: Number(difLevel),
          MARK:
            Number(difLevel) === 4
              ? line.value.length !== 1
                ? `${line.value}:`.split(':')[1]
                : ''
              : undefined
        }
      }
      if (line.key === 'PLAYLEVEL') {
        if (!Number(line.value) && !Number(line.value.slice(0, -1))) {
          return obj
        }
        obj.PLAYLEVEL = {
          LEVEL: Number(line.value) || Number(line.value.slice(0, -1)),
          PLUS: /\+$/.test(line.value),
          TEXT: line.value
        }
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
function getValidMetaLines(sus: string): IValidSusLine[] {
  return sus
    .split('\n')
    .filter(line => line.slice(0, 1) === '#') // sus有効行
    .map(line => line.slice(1)) // #除去
    .filter(line => !line.match(/^\d{3}/)) // 上3桁が数字(譜面データ)除外
    .reduce(
      (list, line) => {
        const key = line
          .slice(0, line.indexOf(' '))
          .trim()
          .toUpperCase()
        if (isSusMeta(key)) {
          const a: IValidSusLine = {
            key,
            value: line.slice(line.indexOf(' ') + 1, line.length).trim()
          }
          list.push(a)
        }
        return list
      },
      [] as IValidSusLine[]
    )
    .map(line => {
      line.value = line.value.match(/^".*"$/)
        ? line.value.slice(1, line.value.length - 1)
        : line.value
      return line
    }) // 文字列リテラルのダブルコーテーション外す
    .filter(line => line.value)
}

type TSusMeta = keyof ISusMeta

interface IValidSusLine {
  key: TSusMeta
  value: string
}

function isSusMeta(s: any): s is TSusMeta {
  return SupportMeta.indexOf(s) > -1
}
