import { Scene } from 'spritejs'
import 'assets/main.less'
import ImageUnitGroup from 'src/components/ImageUnitGroup'

const scene = new Scene('#container', {
  viewport: 'auto',
  resolution: 'flex',
  stickMode: 'top',
  stickExtend: false
})

scene
  .preload({
    id: 'robot',
    src: require('static/bg.png')
  })
  .then(() => {
    const layer = scene.layer()
    const unitGroup1 = new ImageUnitGroup('robot')
    const unitGroup2 = new ImageUnitGroup('robot')

    layer.append(unitGroup1, unitGroup2)

    unitGroup2.focus()
  })
