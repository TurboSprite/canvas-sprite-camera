import { Sprite } from 'spritejs'
import resize from 'assets/images/resize-full.png'

export default class ResizeIconPath extends Sprite {
  /**
   * close icon精灵
   * @param {Array} pos 相对定位
   * @param {Object} spacing
   * @param {number} spacing.border 边框宽度
   * @param {number} spacing.padding 内边距
   *
   * @return {Sprite} closeIconPath 包装后的Icon精灵
   */
  constructor(pos, spacing) {
    super(resize)

    const _spacing = spacing.border + spacing.padding
    const [left] = pos

    this.attr({
      anchor: 0.5,
      size: [60, 60],
      boxSizing: 'border-box',
      zIndex: 2,
      padding: 10,
      pos: [left + _spacing, -_spacing / 2]
    })

    // 默认隐藏
    this.hide()
  }
}
