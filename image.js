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

  sus.longNotes.forEach(long => {
    let processed = 0
    for(let i = 0; i < long.notes.length - 1; i++){
      const note = long.notes[i]
      const note2 = long.notes[i+1]
      const base = note.measure * 768
      const base2 = note2.measure * 768
      const space = 768 / note.split
      const space2 = 768 / note2.split
      
      ctx.beginPath();
      ctx.moveTo(note.lane * 16 + 8 + 4 , base + space * note.pos + 16);
      //ctx.quadraticCurveTo(100,100,30,0);
      ctx.lineTo(note2.lane * 16 + 8 + 4 ,base2 + space2 * note2.pos);
      ctx.lineTo(note2.lane * 16 + 8 + note2.width * 16 - 4,base2 + space2 * note2.pos);
      ctx.lineTo(note.lane * 16 + 8 + note.width * 16 - 4,base + space * note.pos + 16);
      //ctx.quadraticCurveTo(70,100,70,200);
      ctx.closePath();
      // (longs.notes[i+1].pos - long.notes[i].pos) * (768 / long.notes[i+1].split) - 16
      let gradient = ctx.createLinearGradient(0,base + space * note.pos + 16, 0 ,base2 + space2 * note2.pos);
          gradient.addColorStop(0, '#ff4ce1bb');
          gradient.addColorStop(1, '#ff4ce1bb');
      switch(long.type) {
        case '2':
          gradient.addColorStop(0.2, '#f6ff4cbb');
          gradient.addColorStop(0.8, '#f6ff4cbb');
          break
        case '3':
          gradient.addColorStop(0.2, '#4cd5ffbb');
          gradient.addColorStop(0.8, '#4cd5ffbb');
          break
        case '4':
          break
      }
      ctx.fillStyle = gradient //ctx.createPattern(STRUT[long.type], "repeat-x")
      ctx.fill();
      // ctx.drawImage(STRUT[long.type], note.lane * 16 + 8 , base + space * note.pos + 16, note.width * 16, (long.notes[i+1].pos - long.notes[i].pos) * (768 / long.notes[i+1].split) - 16)
    }
    long.notes.forEach(note => {
      if(!(long.type == 2 || long.type == 3)) return
      const base = note.measure * 768
      const space = 768 / note.split
      ctx.drawImage(LONG[long.type].left   ,note.lane * 16 + 8 , base + space * note.pos)
      ctx.drawImage(LONG[long.type].center ,note.lane * 16 + 8 + 4 , base + space * note.pos, note.width * 16 - 8, 16)
      ctx.drawImage(LONG[long.type].right  ,note.lane * 16 + 8 + note.width * 16 - 4, base + space * note.pos)
    })
  })

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



  setTimeout(() => fs.writeFileSync('test.html','<img style="display: block; margin: 0 auto; transform: rotateX(180deg)" src="' + canvas.toDataURL() + '" />'),1000);

}

module.exports = create
