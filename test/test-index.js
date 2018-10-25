const fs = require('fs'),
  ava = require('ava'),
  analyzer = require('../index')

const sus = fs.readFileSync('./test/template.sus', 'utf8');

ava('SONGID',t => t.true(analyzer(sus).SONGID === "SampleSong"))
ava('TITLE',t => t.true(analyzer(sus).TITLE === "Sample Song"))
ava('ARTIST',t => t.true(analyzer(sus).ARTIST === "Sample Artist"))
ava('DESIGNER',t => t.true(analyzer(sus).DESIGNER === "Sample Designer"))
ava('DIFFICULTY1',t => t.true(analyzer(sus).DIFFICULTY.LEVEL === 4))
ava('DIFFICULTY2',t => t.true(analyzer('#DIFFICULTY "4:☆☆両"').DIFFICULTY.LEVEL === 4))
ava('DIFFICULTY3',t => t.true(analyzer('#DIFFICULTY "4:☆☆両"').DIFFICULTY.MARK === "両"))
ava('DIFFICULTY4',t => t.true(analyzer('#DIFFICULTY "4:☆☆両"').DIFFICULTY.STAR === 2))
ava('DIFFICULTY5',t => t.true(analyzer('#DIFFICULTY "両:☆☆"').DIFFICULTY.LEVEL === 4))
ava('DIFFICULTY6',t => t.true(analyzer('#DIFFICULTY "両:☆☆"').DIFFICULTY.MARK === "両"))
ava('DIFFICULTY7',t => t.true(analyzer('#DIFFICULTY "両:☆☆"').DIFFICULTY.STAR === 2))
ava('PLAYLEVEL',t => t.true(analyzer(sus).PLAYLEVEL === 12))
ava('WAVE',t => t.true(analyzer(sus).WAVE === "filename.wav"))
ava('WAVEOFFSET',t => t.true(analyzer(sus).WAVEOFFSET === 0))
ava('JACKET',t => t.true(analyzer(sus).JACKET === "jacket.jpg"))
ava('BACKGROUND',t => t.true(analyzer(sus).BACKGROUND === "image.jpg"))
ava('MOVIE',t => t.true(analyzer(sus).MOVIE === "movie.mp4"))
ava('MOVIEOFFSET',t => t.true(analyzer(sus).MOVIEOFFSET === 0.01))
ava('BASEBPM',t => t.true(analyzer(sus).BASEBPM === 120))
