const fs = require('fs'),
  ava = require('ava'),
  SusAnalyzer = require('../index')

const sus = fs.readFileSync('./test/template.sus', 'utf8');
const metas = SusAnalyzer.getMeta(sus)

ava('ANALYZE SONGID',         t => t.is(metas.SONGID, "SampleSong"))
ava('ANALYZE TITLE',          t => t.is(metas.TITLE, "Sample Song"))
ava('ANALYZE ARTIST',         t => t.is(metas.ARTIST, "Sample Artist"))
ava('ANALYZE DESIGNER',       t => t.is(metas.DESIGNER, "Sample Designer"))
ava('ANALYZE DIFFICULTY1',    t => t.is(metas.DIFFICULTY.LEVEL, 4))
ava('ANALYZE DIFFICULTY2',    t => t.is(SusAnalyzer.getMeta('#DIFFICULTY "4:両"').DIFFICULTY.MARK, '両'))
ava('ANALYZE DIFFICULTY3',    t => t.is(SusAnalyzer.getMeta('#DIFFICULTY "4:"').DIFFICULTY.MARK, null))
ava('ANALYZE DIFFICULTY4',    t => t.false(SusAnalyzer.getMeta('#DIFFICULTY "両"').hasOwnProperty('DIFFICULTY')))
ava('ANALYZE DIFFICULTY5',    t => t.false(SusAnalyzer.getMeta('#DIFFICULTY "3:両"').DIFFICULTY.hasOwnProperty('MARK')))
ava('ANALYZE DIFFICULTY6',    t => t.is(SusAnalyzer.getMeta('#DIFFICULTY 3').DIFFICULTY.TEXT, "MASTER"))
ava('ANALYZE DIFFICULTY7',    t => t.false(SusAnalyzer.getMeta('#DIFFICULTY 5').hasOwnProperty('DIFFICULTY')))
ava('ANALYZE PLAYLEVEL',      t => t.is(SusAnalyzer.getMeta('#PLAYLEVEL 12').PLAYLEVEL.LEVEL, 12))
ava('ANALYZE PLAYLEVEL+',     t => t.is(SusAnalyzer.getMeta('#PLAYLEVEL 12+').PLAYLEVEL.PLUS, 1))
ava('ANALYZE PLAYLEVEL TEXT', t => t.is(SusAnalyzer.getMeta('#PLAYLEVEL 12+').PLAYLEVEL.TEXT, "12+"))
ava('ANALYZE WAVE',           t => t.is(metas.WAVE, "filename.wav"))
ava('ANALYZE WAVEOFFSET',     t => t.is(metas.WAVEOFFSET, 0))
ava('ANALYZE JACKET',         t => t.is(metas.JACKET, "jacket.jpg"))
ava('ANALYZE BACKGROUND',     t => t.is(metas.BACKGROUND, "image.jpg"))
ava('ANALYZE MOVIE',          t => t.is(metas.MOVIE, "movie.mp4"))
ava('ANALYZE MOVIEOFFSET',    t => t.is(metas.MOVIEOFFSET, 0.01))
ava('ANALYZE BASEBPM',        t => t.is(metas.BASEBPM, 120))
ava('ANALYZE BAD BASEBPM',    t => t.false(SusAnalyzer.getMeta('#BASEBPM NaN').hasOwnProperty('BASEBPM')))
ava('ANALYZE BAD BASEBPM',    t => t.false(SusAnalyzer.getMeta('#PLAYLEVEL NaN').hasOwnProperty('PLAYLEVEL')))

ava('VALIDATE GOOD SUS',      t => t.true(SusAnalyzer.validate(sus).VALIDITY))
ava('VALIDATE BAD SUS',       t => t.false(SusAnalyzer.validate("#TITLE test").VALIDITY))
ava('VALIDATE BAD SUS - MISSING META',t => t.deepEqual(SusAnalyzer.validate("#TITLE test").MISSING_META.toString(), [ 'SONGID', 'ARTIST', 'DESIGNER', 'DIFFICULTY', 'PLAYLEVEL' ].toString()))
