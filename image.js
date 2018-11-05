const { createCanvas, loadImage } = require('canvas')

const fs = require('fs')

const create = async sus => {

  const canvas = createCanvas(272, 768 * sus.measure)
  const ctx = canvas.getContext('2d')

  const tap_left = await loadImage('asset/tap-left.png')
  const tap_right = await loadImage('asset/tap-right.png')
  const tap_center = await loadImage('asset/tap-center.png')
  const measure = await loadImage('asset/measure.png')
  const split = await loadImage('asset/split.png')

  // 起点変更
  ctx.transform(1, 0, 0, -1, 0, 768 * sus.measure)

  // Draw Base
  for(let i = 0; i < sus.measure; i++) ctx.drawImage(measure, 0, i*768)

  // Draw Beat Line
  let drawedMeasure = sus.measure
  sus.BEATs.reverse().forEach(e => {
    console.log(e)
    for(let i = e.measure; i < drawedMeasure; i++){
      console.log(i)
      const startPos = i * 768
      const space = 768 / e.beat
      for(let j = 1; j < e.beat; j++)
        ctx.drawImage(split, 0, startPos + space*j)
    }
    drawedMeasure = e.measure
  })

  sus.shortNoteLines.forEach(e => {
  })


  setTimeout(() => fs.writeFileSync('test.html','<img src="' + canvas.toDataURL() + '" />'),1000);

}

function drawTAP(width) {
  ctx.drawImage(tap_left, 8, 50)
  ctx.drawImage(tap_center, 12, 50)
  ctx.drawImage(tap_center, 16, 50)
  ctx.drawImage(tap_center, 20, 50)
  ctx.drawImage(tap_center, 24, 50)
  ctx.drawImage(tap_center, 28, 50)
  ctx.drawImage(tap_center, 32, 50)
  ctx.drawImage(tap_center, 36, 50)
  ctx.drawImage(tap_center, 40, 50)
  ctx.drawImage(tap_center, 44, 50)
  ctx.drawImage(tap_center, 48, 50)
  ctx.drawImage(tap_center, 52, 50)
  ctx.drawImage(tap_center, 56, 50)
  ctx.drawImage(tap_center, 60, 50)
  ctx.drawImage(tap_center, 64, 50)
  ctx.drawImage(tap_right, 68, 50)
}

module.exports = create
