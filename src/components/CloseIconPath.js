import { Sprite } from 'spritejs'
import close from 'assets/images/close.png'

export default class CloseIconPath extends Sprite {
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
    super(close)

    const [, top] = pos
    const _spacing = spacing.border + spacing.padding

    this.attr({
      anchor: 0.5,
      zIndex: 2,
      size: [50, 50],
      pos: [_spacing, top + _spacing]
    })

    // 默认隐藏
    this.hide()
  }
}
