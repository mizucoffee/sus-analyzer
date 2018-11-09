const fs = require('fs'),
  ava = require('ava'),
  SusAnalyzer = require('../index')

const sus = fs.readFileSync('./test/template.sus', 'utf8');
const score = SusAnalyzer.getData(sus)

ava('Measure',       t => t.is(score.measure                       , 21))
ava('BPMs',          t => t.is(score.BPMs[0].measure               , 0))
ava('BEATs',         t => t.is(score.BEATs[1].beat                 , 3))
ava('Short Measure', t => t.is(score.shortNoteLines[8].measure     , 2))
ava('Short Type',    t => t.is(score.shortNoteLines[8].type        , '1'))
ava('Short Lane',    t => t.is(score.shortNoteLines[8].lane        , 0))
ava('Short Split',   t => t.is(score.shortNoteLines[8].split       , 4))
ava('Short Data',    t => t.is(score.shortNoteLines[8].data[0].pos , 0))
