import { Group } from 'spritejs'
import _ from 'lodash'

import ImageSprite from 'src/components/ImageSprite'
import CloseIconPath from 'src/components/CloseIconPath'
import ResizeIconPath from 'src/components/ResizeIconPath'

/**
 * 扩展为可操作的素材组
 */
export default class ImageUnitGroup extends Group {
  /**
   * 标记组层级
   */
  static zIndex = 1

  /**
   * 当前获得焦点的组
   */
  static focusGroup

  // 当前组是否处于焦点状态
  get isFocus() {
    return ImageUnitGroup.focusGroup === this
  }

  /**
   * 操作项：缩放、拖动、删除
   * @param {string} image 图片名称 或者地址
   *
   * @return {Object} 扩展的可操作素材组
   */
  constructor(image) {
    super()
    // group 和 image之间的间隔
    this.spacing = {
      padding: 20,
      border: 6
    }

    // 主图
    this.imageSprite = new ImageSprite(image, this.spacing)
    // close icon
    this.closeIconSprite = new CloseIconPath(this.imageSprite.contentSize, this.spacing)
    // resize icon
    this.resizeIconSprite = new ResizeIconPath(this.imageSprite.offsetSize, this.spacing)

    this.attr({
      pos: [100, 100]
    })

    this.append(this.imageSprite, this.closeIconSprite, this.resizeIconSprite)

    // 拖动相关数据
    this.x0
    this.y0
    this.startPos

    // 拖动放大
    this._startResizeX
    this._startResizeY
    this.zoomScale = _.divide(...this.imageSprite.contentSize)

    // 绑定事件
    this.bindEvent()
  }

  bindEvent() {
    // 单击
    this.on('click', this.handleClick)

    // 拖动
    this.on('touchstart', this.handleMoveStart)

    // 删除本节点
    this.closeIconSprite.on('click', this.handleRemoveGroup)

    // 缩放
    this.resizeIconSprite.on('touchstart', this.handleResizeStart)
  }

  // 点击动画
  handleClick = async evt => {
    if (evt.targetSprites && evt.targetSprites.length > 0) {
      evt.stopDispatch()

      // 将事件处理为异步
      setTimeout(() => {
        if (this._focus) {
          // 点击焦点组：失去焦点
          this.blur()
          delete ImageUnitGroup.focusGroup
        }
      }, 0)
    }
  }

  handleMoveStart = evt => {
    // 命中resize按钮
    if (evt.targetSprites && evt.targetSprites.includes(this.resizeIconSprite)) {
      evt.stopDispatch()

      return
    }

    // 判断命中区域
    if (evt.targetSprites && evt.targetSprites.length > 0) {
      // 记录当前是否是焦点状态
      this._focus = ImageUnitGroup.focusGroup === this
      this.focus()

      this.x0 = evt.x
      this.y0 = evt.y
      this.startPos = this.attr('pos')
      this.parent.off('touchmove', this.handleMove)
      this.parent.on('touchmove', this.handleMove)
      this.parent.on('touchend', this.handleMoveEnd)

      // 变大
      this.transition(0.15).attr({
        scale: [1.03, 1.03]
      })

      evt.stopDispatch()
    }
  }

  // 处理移动
  handleMove = evt => {
    const dx = evt.x - this.x0
    const dy = evt.y - this.y0

    this.attr('pos', [this.startPos[0] + dx, this.startPos[1] + dy])
    evt.stopDispatch()
  }

  handleMoveEnd = evt => {
    this.parent.off('touchmove', this.handleMove)
    this.parent.off('touchend', this.handleMoveEnd)
    evt.stopDispatch()

    this.scaleTimer && clearTimeout(this.scaleTimer)
    this.scaleTimer = setTimeout(() => {
      this.transition(0.15).attr({
        scale: [1, 1]
      })
    }, 150)
  }

  // 将本group从父节点删除
  handleRemoveGroup = evt => {
    this.remove()
    evt.stopDispatch()
  }

  handleResizeStart = evt => {
    this._startResizeX = evt.x
    this._startResizeY = evt.y
    this.resizePos = this.resizeIconSprite.attr('pos')
    this.imageSpriteSize = this.imageSprite.contentSize

    this.parent.off('touchmove', this.handleResize)
    this.parent.on('touchmove', this.handleResize)
    this.parent.on('touchend', this.handleResizeEnd)
    evt.stopDispatch()
  }

  handleResize = evt => {
    const { x, y } = evt
    const moveX = x - this._startResizeX
    const moveY = this._startResizeY - y
    const width = this.imageSpriteSize[0] + moveX
    const height = this.imageSpriteSize[1] + moveY

    // 限制缩小最小size
    if (width < 40 || height < 40) {
      return
    }
    const dx = x - this._startResizeX
    const dy = this._startResizeY - y

    if (dx < dy) {
      this.resizeIconSprite.attr('pos', [this.resizePos[0] + dx, this.resizePos[1] - dx / this.zoomScale])
      this.imageSprite.attr('size', [width])
    } else {
      this.resizeIconSprite.attr('pos', [this.resizePos[0] + dy * this.zoomScale, this.resizePos[1] - dy])
      this.imageSprite.attr('size', [height * this.zoomScale])
    }

    evt.stopDispatch()
  }

  handleResizeEnd = evt => {
    this.parent.off('touchmove', this.handleResize)
    this.parent.off('touchend', this.handleResizeEnd)

    evt.stopDispatch()
  }

  // 获得焦点方法
  focus = () => {
    this.attr({ zIndex: ImageUnitGroup.zIndex++ })

    this.imageSprite.attr('border', {
      style: [10, 20],
      width: this.spacing.border,
      color: '#37c'
    })
    this.resizeIconSprite.show()
    this.closeIconSprite.show()

    if (!this._focus) {
      if (ImageUnitGroup.focusGroup) {
        // 让上一个焦点元素blur
        ImageUnitGroup.focusGroup.blur()
      }
      ImageUnitGroup.focusGroup = this
    }
  }

  // 失去焦点方法
  blur = () => {
    this.imageSprite.attr('border', {
      style: [10, 20],
      width: this.spacing.border,
      color: 'transparent'
    })
    this.resizeIconSprite.hide()
    this.closeIconSprite.hide()
  }
}
