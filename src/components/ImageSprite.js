/**
 * 图片部件精灵
 */
import { Sprite } from 'spritejs'

export default class ImageSprite extends Sprite {
  /**
   * 图片部件精灵
   * @param {string|Image} image 图片元素
   * @param {Object} spacing
   * @param {number} spacing.border 边框宽度
   * @param {number} spacing.padding 内边距
   *
   * @return {Sprite} imageSprite 包装后的图片精灵
   */
  constructor(image, spacing) {
    super(image)

    const _spacing = spacing.border + spacing.padding

    this.attr({
      anchor: [0, 1],
      pos: [_spacing, this.contentSize[1] + _spacing],
      zIndex: 1,
      border: {
        style: [10, 20],
        width: spacing.border,
        color: 'transparent'
      },
      borderRadius: 20,
      padding: spacing.padding
    })
  }
}
