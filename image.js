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
      left: await loadImage('asset/extap-left.png'),
      center: await loadImage('asset/extap-center.png'),
      right: await loadImage('asset/extap-right.png')
    },
    3: {
      left: await loadImage('asset/flick-left.png'),
      center: await loadImage('asset/flick-center.png'),
      right: await loadImage('asset/flick-right.png')
    },
    4: {
      left: await loadImage('asset/hell-left.png'),
      center: await loadImage('asset/hell-center.png'),
      right: await loadImage('asset/hell-right.png')
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
  const air = {
    1: await loadImage('asset/air-up.png'),
    2: await loadImage('asset/air-down.png'),
    3: await loadImage('asset/air-up-left.png'),
    4: await loadImage('asset/air-up-right.png'),
    5: await loadImage('asset/air-down-left.png'),
    6: await loadImage('asset/air-down-right.png'),
    7: await loadImage('asset/air-up.png'),
    8: await loadImage('asset/air-up-left.png'),
    9: await loadImage('asset/air-up-right.png'),
  }
  const LONG = {
    '2': {
      left: await loadImage('asset/hold-left.png'),
      center: await loadImage('asset/hold-center.png'),
      step_center: await loadImage('asset/hold-step-center.png'),
      right: await loadImage('asset/hold-right.png'),
    },
    '3': {
      left: await loadImage('asset/slide-left.png'),
      center: await loadImage('asset/slide-center.png'),
      step_center: await loadImage('asset/slide-step-center.png'),
      right: await loadImage('asset/slide-right.png'),
    }
  }

  const measure = await loadImage('asset/measure.png')
  const split = await loadImage('asset/split.png')

  // 起点変更
  //ctx.transform(1, 0, 0, -1, 0, 768 * sus.measure)

  // 小節線描画
  for(let i = -1; i < sus.measure; i++) ctx.drawImage(measure, 0, i*768 + 16)

  // 拍線描画
  let drawedMeasure = sus.measure
  sus.BEATs.reverse().forEach(e => {
    for(let i = e.measure; i < drawedMeasure; i++){
      const startPos = i * 768
      const space = 768 / e.beat
      for(let j = 1; j < e.beat; j++)
        ctx.drawImage(split, 0, startPos + space*j + 16)
    }
    drawedMeasure = e.measure
  })

  ctx.translate(0,8)

  sus.shortNoteLines.forEach(measure => {
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
        measure.data.forEach(note => {
          if(note.type == '0') return
          switch (note.type) {
            case '1':
            case '2':
            case '7':
              ctx.drawImage(air[note.type] ,measure.lane * 16 + 8 , base + space * note.pos + 20, note.width * 16, note.width * 8)
              break
            case '3':
            case '6':
            case '8':
              ctx.drawImage(air[note.type] ,measure.lane * 16 + 8 - 16 , base + space * note.pos + 20, note.width * 16, note.width * 8)
              break
            case '4':
            case '5':
            case '9':
              ctx.drawImage(air[note.type] ,measure.lane * 16 + 8 + 16 , base + space * note.pos + 20, note.width * 16, note.width * 8)
              break
          }
        })
        break
    }
  })

  sus.longNotes.forEach(long => {
    long.notes.forEach(note => {
      if(!(long.type == 2 || long.type == 3)) return
      const base = note.measure * 768
      const space = 768 / note.split
      ctx.drawImage(LONG[long.type].left   ,note.lane * 16 + 8 , base + space * note.pos)
      ctx.drawImage(LONG[long.type].center ,note.lane * 16 + 8 + 4 , base + space * note.pos, note.width * 16 - 8, 16)
      ctx.drawImage(LONG[long.type].right  ,note.lane * 16 + 8 + note.width * 16 - 4, base + space * note.pos)

    })
  })



  setTimeout(() => fs.writeFileSync('test.html','<img style="display: block; margin: 0 auto; transform: rotateX(180deg)" src="' + canvas.toDataURL() + '" />'),1000);

}

module.exports = create
