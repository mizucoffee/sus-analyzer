const difficultys = {
  0: { TEXT: 'BASIC', COLOR: '#19aa19', BACKGROUND: '#e8f6e8' },
  1: { TEXT: 'ADVANCED', COLOR: '#f55000', BACKGROUND: '#feede5' },
  2: { TEXT: 'EXPERT', COLOR: '#a00a50', BACKGROUND: '#F5E6ED' },
  3: { TEXT: 'MASTER', COLOR: '#8200dc', BACKGROUND: '#f2e5fb' },
  4: { TEXT: "WORLD'S END", COLOR: '#000000', BACKGROUND: '#e5e5e5' },
}

const support_meta = [
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
  'BASEBPM',
]
const required_meta = [
  'SONGID',
  'TITLE',
  'ARTIST',
  'DESIGNER',
  'DIFFICULTY',
  'PLAYLEVEL',
]

/**
 * メタデータのオブジェクトを返す関数
 * @param {String} sus - sus
 * @return メタデータのオブジェクト
 */
const getMeta = sus =>
  susToMetaArray(sus).reduce((p, c) => {
    p[c[0]] = c[1]
    return p
  }, {})

/**
 * sus譜面が有効かどうかを返す関数
 * @param {String} sus - sus
 * @return 有効かどうかの真偽値
 */
const validate = sus => {
  const meta = getMeta(sus)

  const req = required_meta.slice()
  if (meta.hasOwnProperty('WAVE')) req.push('WAVEOFFSET')
  if (meta.hasOwnProperty('MOVIE')) req.push('MOVIEOFFSET')
  if (meta.hasOwnProperty('DIFFICULTY') && meta.DIFFICULTY.LEVEL === 4)
    req.splice(req.indexOf('PLAYLEVEL'), 1)
  const missing_meta = req.filter(line => !meta.hasOwnProperty(line))

  return { VALIDITY: missing_meta.length === 0, MISSING_META: missing_meta }
}

/**
 * susのメタデータを配列に変換する関数
 * @param {String} sus - sus
 * @return メタデータの配列
 */
const susToMetaArray = sus => {
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
      line.slice(line.indexOf(' ') + 1, line.length).trim(),
    ])
    .filter(line => support_meta.indexOf(line[0]) >= 0) // 非対応メタデータ除外
    .map(line => {
      if (
        line[1].slice(0, 1) == '"' &&
        line[1].slice(line[1].length - 1) == '"'
      )
        line[1] = line[1].slice(1, line[1].length - 1)
      return line
    }) // 文字列リテラルの
    .filter(line => line[1])
    .map(line => {
      let data = line[1]
      switch (line[0]) {
        case 'DIFFICULTY':
          line[1] = {}
          line[1].LEVEL = Number.isFinite(Number(data.slice(0, 1)))
            ? Number(data.slice(0, 1))
            : -1
          if (0 > line[1].LEVEL || line[1].LEVEL > 4) return null
          line[1] = Object.assign(line[1], difficultys[line[1].LEVEL])
          if (line[1].LEVEL !== 4) break
          line[1].MARK =
            data.length !== 1 ? `${data}:`.split(':')[1] || null : null
          break
        case 'WAVEOFFSET':
        case 'MOVIEOFFSET':
        case 'BASEBPM':
          if (!Number.isFinite(Number(line[1]))) return null
          line[1] = Number(line[1])
          break
        case 'PLAYLEVEL':
          line[1] = {}
          if (data.slice(-1) === '+') {
            line[1].PLUS = 1
            data = data.slice(0, -1)
          }
          if (!Number.isFinite(Number(data))) return null
          line[1].LEVEL = Number(data)
          line[1].TEXT = `${line[1].LEVEL}${line[1].PLUS ? '+' : ''}`
          break
      }
      return line
    })
    .filter(line => line)
}

module.exports = {
  getMeta: getMeta,
  validate: validate,
}
