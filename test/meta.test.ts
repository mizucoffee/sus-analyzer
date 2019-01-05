import * as fs from 'fs'
import * as SusAnalyzer from '../src'

const sus = fs.readFileSync('./test/example.sus', 'utf8')
const metas = SusAnalyzer.getMeta(sus)

test('getMeta().SONGID', () => expect(metas.SONGID).toBe('SampleSong'))
test('getMeta().TITLE', () => expect(metas.TITLE).toBe('Sample Song'))
test('getMeta().ARTIST', () => expect(metas.ARTIST).toBe('Sample Artist'))
test('getMeta().DESIGNER', () => expect(metas.DESIGNER).toBe('Sample Designer'))
test('getMeta().DIFFICULTY', () => {
  expect(metas.DIFFICULTY).toBeDefined()
  if (metas.DIFFICULTY != null) {
    expect(metas.DIFFICULTY.LEVEL).toBe(4)
    expect(metas.DIFFICULTY.MARK).toBe('廻')
    expect(metas.DIFFICULTY.BACKGROUND).toBe('#e5e5e5')
    expect(metas.DIFFICULTY.COLOR).toBe('#000000')
    expect(metas.DIFFICULTY.TEXT).toBe("WORLD'S END")
  }
})
test('getMeta().DIFFICULTY SPECIAL', () => {
  const noMark = SusAnalyzer.getMeta('#DIFFICULTY 4:')
  expect(noMark.DIFFICULTY).toBeDefined()
  if (noMark.DIFFICULTY != null) {
    expect(noMark.DIFFICULTY.LEVEL).toBe(4)
    expect(noMark.DIFFICULTY.MARK).toBe('')
  }
})
test('getMeta().PLAYLEVEL', () => {
  expect(metas.PLAYLEVEL).toBeDefined()
  if (metas.PLAYLEVEL != null) {
    expect(metas.PLAYLEVEL.LEVEL).toBe(3)
    expect(metas.PLAYLEVEL.TEXT).toBe('3')
    expect(metas.PLAYLEVEL.PLUS).toBe(false)
  }
})
test('getMeta().PLAYLEVEL SPECIAL', () => {
  const plus = SusAnalyzer.getMeta('#PLAYLEVEL 12+')
  expect(plus.PLAYLEVEL).toBeDefined()
  if (plus.PLAYLEVEL != null) {
    expect(plus.PLAYLEVEL.LEVEL).toBe(12)
    expect(plus.PLAYLEVEL.TEXT).toBe('12+')
    expect(plus.PLAYLEVEL.PLUS).toBe(true)
  }
  const undef = SusAnalyzer.getMeta('#PLAYLEVEL NaN')
  expect(undef.PLAYLEVEL).toBeUndefined()
})

test('getMeta().WAVE', () => expect(metas.WAVE).toBe('filename.wav'))
test('getMeta().WAVEOFFSET', () => expect(metas.WAVEOFFSET).toBe(-0.01))
test('getMeta().JACKET', () => expect(metas.JACKET).toBe('jacket.jpg'))
test('getMeta().BACKGROUND', () => expect(metas.BACKGROUND).toBe('image.jpg'))
test('getMeta().MOVIE', () => expect(metas.MOVIE).toBe('movie.mp4'))
test('getMeta().MOVIEOFFSET', () => expect(metas.MOVIEOFFSET).toBe(0.01))
test('getMeta().BASEBPM', () => expect(metas.BASEBPM).toBe(120))
test('validity().VALIDITY', () => {
  expect(SusAnalyzer.validate(sus).VALIDITY).toBe(true)

  const badsus = SusAnalyzer.validate('#TITLE test')
  expect(badsus.VALIDITY).toBe(false)
  expect(badsus.MISSING_META).toEqual(
    expect.arrayContaining([
      'SONGID',
      'ARTIST',
      'DESIGNER',
      'DIFFICULTY',
      'PLAYLEVEL'
    ])
  )
})
