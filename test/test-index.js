const fs = require('fs'),
  ava = require('ava'),
  SusAnalyzer = require('../index')

const sus = fs.readFileSync('./test/template.sus', 'utf8');

ava('ANALYZE SONGID',t => t.true(SusAnalyzer.getMeta(sus).SONGID === "SampleSong"))
ava('ANALYZE TITLE',t => t.true(SusAnalyzer.getMeta(sus).TITLE === "Sample Song"))
ava('ANALYZE ARTIST',t => t.true(SusAnalyzer.getMeta(sus).ARTIST === "Sample Artist"))
ava('ANALYZE DESIGNER',t => t.true(SusAnalyzer.getMeta(sus).DESIGNER === "Sample Designer"))
ava('ANALYZE DIFFICULTY1',t => t.true(SusAnalyzer.getMeta(sus).DIFFICULTY.LEVEL === 4))
ava('ANALYZE DIFFICULTY2',t => t.true(SusAnalyzer.getMeta('#DIFFICULTY "4:☆☆両"').DIFFICULTY.LEVEL === 4))
ava('ANALYZE DIFFICULTY3',t => t.true(SusAnalyzer.getMeta('#DIFFICULTY "4:☆☆両"').DIFFICULTY.MARK === "両"))
ava('ANALYZE DIFFICULTY4',t => t.true(SusAnalyzer.getMeta('#DIFFICULTY "4:☆☆両"').DIFFICULTY.STAR === 2))
ava('ANALYZE DIFFICULTY5',t => t.true(SusAnalyzer.getMeta('#DIFFICULTY "両:☆☆"').DIFFICULTY.LEVEL === 4))
ava('ANALYZE DIFFICULTY6',t => t.true(SusAnalyzer.getMeta('#DIFFICULTY "両:☆☆"').DIFFICULTY.MARK === "両"))
ava('ANALYZE DIFFICULTY7',t => t.true(SusAnalyzer.getMeta('#DIFFICULTY "両:☆☆"').DIFFICULTY.STAR === 2))
ava('ANALYZE PLAYLEVEL',t => t.true(SusAnalyzer.getMeta(sus).PLAYLEVEL === 12))
ava('ANALYZE WAVE',t => t.true(SusAnalyzer.getMeta(sus).WAVE === "filename.wav"))
ava('ANALYZE WAVEOFFSET',t => t.true(SusAnalyzer.getMeta(sus).WAVEOFFSET === 0))
ava('ANALYZE JACKET',t => t.true(SusAnalyzer.getMeta(sus).JACKET === "jacket.jpg"))
ava('ANALYZE BACKGROUND',t => t.true(SusAnalyzer.getMeta(sus).BACKGROUND === "image.jpg"))
ava('ANALYZE MOVIE',t => t.true(SusAnalyzer.getMeta(sus).MOVIE === "movie.mp4"))
ava('ANALYZE MOVIEOFFSET',t => t.true(SusAnalyzer.getMeta(sus).MOVIEOFFSET === 0.01))
ava('ANALYZE BASEBPM',t => t.true(SusAnalyzer.getMeta(sus).BASEBPM === 120))
ava('ANALYZE BASEBPM',t => t.true(SusAnalyzer.getMeta(sus).BASEBPM === 120))

ava('VALIDATE GOOD SUS',t => t.true(SusAnalyzer.validate(sus).VALIDITY))
ava('VALIDATE BAD SUS',t => t.false(SusAnalyzer.validate("#TITLE test").VALIDITY))
ava('VALIDATE BAD SUS - MISSING META',t => t.true(SusAnalyzer.validate("#TITLE test").MISSING_META.toString() === [ 'SONGID', 'ARTIST', 'DESIGNER', 'DIFFICULTY', 'PLAYLEVEL', 'WAVE', 'WAVEOFFSET' ].toString()))
