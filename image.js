const { createCanvas, loadImage } = require('canvas')

const fs = require('fs')

const create = async sus => {

  const canvas = createCanvas(272, 768 * sus.measure + 16)
  const ctx = canvas.getContext('2d')

  const notes = {
    1: {
      left: await loadImage('asset/tap-left.png'),
      center: await loadImage('asset/tap-center.png'),
      right: await loadImage('asset/tap-right.png')
    },
    2: {
      left: await loadImage('asset/tap-left.png'),
      center: await loadImage('asset/tap-center.png'),
      right: await loadImage('asset/tap-right.png')
    },
    3: {
      left: await loadImage('asset/tap-left.png'),
      center: await loadImage('asset/tap-center.png'),
      right: await loadImage('asset/tap-right.png')
    },
    4: {
      left: await loadImage('asset/tap-left.png'),
      center: await loadImage('asset/tap-center.png'),
      right: await loadImage('asset/tap-right.png')
    },
    5: {
      left: await loadImage('asset/tap-left.png'),
      center: await loadImage('asset/tap-center.png'),
      right: await loadImage('asset/tap-right.png')
    },
    6: {
      left: await loadImage('asset/tap-left.png'),
      center: await loadImage('asset/tap-center.png'),
      right: await loadImage('asset/tap-right.png')
    },
  }
  const measure = await loadImage('asset/measure.png')
  const split = await loadImage('asset/split.png')

  // 起点変更
  ctx.transform(1, 0, 0, -1, 0, 768 * sus.measure)

  // 小節描画
  for(let i = 0; i < sus.measure; i++) ctx.drawImage(measure, 0, i*768)
  ctx.drawImage(measure, 0, -768)
  
  ctx.translate(0,-8)

  // 拍線描画
  let drawedMeasure = sus.measure
  sus.BEATs.reverse().forEach(e => {
    for(let i = e.measure; i < drawedMeasure; i++){
      const startPos = i * 768
      const space = 768 / e.beat
      for(let j = 1; j < e.beat; j++)
        ctx.drawImage(split, 0, startPos + space*j)
    }
    drawedMeasure = e.measure
  })

  sus.shortNoteLines.forEach(measure => {
    console.log(measure)
    const base = measure.measure * 768
    const space = 768 / measure.split
    switch(measure.type) {
      case '1':
        measure.data.forEach(note => {
          if(note.type == '0') return
          ctx.drawImage(notes[note.type].left   ,measure.lane * 16 + 8 , base + space * note.pos)
          ctx.drawImage(notes[note.type].center ,measure.lane * 16 + 8 + 4 , base + space * note.pos, note.width * 16 - 8, 16)
          ctx.drawImage(notes[note.type].right  ,measure.lane * 16 + 8 + note.width * 16 - 4, base + space * note.pos)
        })
        break
      case '5':
        break
    }
    //ctx.drawImage(tap_left, 8, 50)
    //ctx.drawImage(tap_center, 12, 50)
    //ctx.drawImage(tap_right, 68, 50)
  })


  setTimeout(() => fs.writeFileSync('test.html','<img style="display: block; margin: 0 auto;" src="' + canvas.toDataURL() + '" />'),1000);

}

module.exports = create
