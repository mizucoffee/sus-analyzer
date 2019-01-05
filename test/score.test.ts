import * as fs from 'fs'
import * as SusAnalyzer from '../src'

const sus = fs.readFileSync('./test/example.sus', 'utf8')
const score = SusAnalyzer.getScore(sus)

test('getScore().measure', () => expect(score.measure).toBe(23))
test('getScore().BPMs', () => {
  expect(score.BPMs[1]).toBe(120)
  expect(score.BPMs[2]).toBe(80)
  expect(SusAnalyzer.getScore('').BPMs[0]).toBe(120)
})
test('getScore().BEATs', () => {
  expect(score.BEATs[2]).toBe(4)
  expect(score.BEATs[3]).toBe(3)
})
test('getScore().shortNotes[]', () => {
  const short = score.shortNotes[8]
  expect(short.measure).toBe(1)
  expect(short.laneType).toBe(1)
  expect(short.lane).toBe(8)
  expect(short.noteType).toBe(3)
  expect(short.tick).toBe(0)
  expect(short.width).toBe(4)
  expect(short.channel).toBeUndefined()
})
test('getScore().holdNotes[]', () => {
  const hold = score.holdNotes[4][1]
  expect(hold.measure).toBe(6)
  expect(hold.laneType).toBe(2)
  expect(hold.lane).toBe(6)
  expect(hold.noteType).toBe(2)
  expect(hold.tick).toBe(384)
  expect(hold.width).toBe(4)
  expect(hold.channel).toBe(65)
})
test('getScore().slideNotes[]', () => {
  const slide = score.slideNotes[4][0]
  expect(slide.measure).toBe(8)
  expect(slide.laneType).toBe(3)
  expect(slide.lane).toBe(0)
  expect(slide.noteType).toBe(1)
  expect(slide.tick).toBe(0)
  expect(slide.width).toBe(4)
  expect(slide.channel).toBe(65)
})
test('getScore().airActionNotes[]', () => {
  const airaction = score.airActionNotes[2][3]
  expect(airaction.measure).toBe(14)
  expect(airaction.laneType).toBe(4)
  expect(airaction.lane).toBe(12)
  expect(airaction.noteType).toBe(4)
  expect(airaction.tick).toBe(288)
  expect(airaction.width).toBe(4)
  expect(airaction.channel).toBe(65)
})
test('getScore().airNotes[]', () => {
  const air = score.airNotes[8]
  expect(air.measure).toBe(14)
  expect(air.laneType).toBe(5)
  expect(air.lane).toBe(12)
  expect(air.noteType).toBe(1)
  expect(air.tick).toBe(0)
  expect(air.width).toBe(4)
  expect(air.channel).toBeUndefined()
})
test('SPECIAL', () => {
  expect(SusAnalyzer.getScore('#00030A: 00002400').slideNotes.length).toBe(0)
  expect(SusAnalyzer.getScore('#00030A: 00003400').slideNotes.length).toBe(0)
  expect(SusAnalyzer.getScore('#00308: 1').slideNotes.length).toBe(0)
  expect(SusAnalyzer.getScore('#00030: 00142400').slideNotes.length).toBe(0)
})
