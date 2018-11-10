const fs = require('fs'),
  ava = require('ava'),
  SusAnalyzer = require('../index')

const sus = fs.readFileSync('./test/template.sus', 'utf8');
const score = SusAnalyzer.getData(sus)

ava('Measure',         t => t.is(score.measure                    , 21))
ava('BPMs',            t => t.is(score.BPMs[3]                    , 80))
ava('BEATs',           t => t.is(score.BEATs[3]                   , 3))
ava('Short Measure',   t => t.is(score.shortNotes[8].measure      , 1))
ava('Short Lane Type', t => t.is(score.shortNotes[8].lane_type    , 1))
ava('Short Lane',      t => t.is(score.shortNotes[8].lane         , 4))
ava('Short Note Type', t => t.is(score.shortNotes[8].note_type    , 2))
ava('Short Position',  t => t.is(score.shortNotes[8].position     , 0))
ava('Short Width',     t => t.is(score.shortNotes[8].width        , 4))

ava('Default BPM1',    t => t.is(SusAnalyzer.getData("#BPM01: 100\n#00308 01\n#00510:00").BPMs[0]  , 120))
ava('Default BPM2',    t => t.is(SusAnalyzer.getData("#00308 01\n#00510:00").BPMs[0]  , 120))
ava('Default BEATs',   t => t.is(SusAnalyzer.getData("").BEATs[0] , 4))
