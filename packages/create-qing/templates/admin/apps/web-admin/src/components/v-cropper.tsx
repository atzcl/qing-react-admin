import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'

export interface VCropperRef {
  getCropImage: (
    type?: string,
    quality?: number,
    output?: 'base64' | 'blob',
    targetWidth?: number,
    targetHeight?: number,
  ) => Promise<Blob | string>
}

interface VCropperProps {
  aspectRatio?: string | undefined
  height?: number
  img: string
  width?: number
}

interface Rect {
  height: number
  width: number
  x: number
  y: number
}

type ResizeHandle = 'e' | 'n' | 'ne' | 'nw' | 's' | 'se' | 'sw' | 'w'

const MIN_CROP_SIZE = 60

function parseRatio(value?: string) {
  if (!value) return undefined
  const [ratioWidth, ratioHeight] = value.split(':').map(Number)
  return ratioWidth && ratioHeight ? ratioWidth / ratioHeight : undefined
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value))
}

function initialCrop(width: number, height: number, ratio?: number): Rect {
  const maxWidth = width * 0.8
  const maxHeight = height * 0.8
  const cropWidth = ratio ? Math.min(maxWidth, maxHeight * ratio) : maxWidth
  const cropHeight = ratio ? cropWidth / ratio : maxHeight
  return {
    height: cropHeight,
    width: cropWidth,
    x: (width - cropWidth) / 2,
    y: (height - cropHeight) / 2,
  }
}

/** React 19 版 VCropper：裁剪框支持移动、八向缩放、固定/自由比例与本地导出。 */
export const VCropper = forwardRef<VCropperRef, VCropperProps>(function VCropper(
  { aspectRatio, height = 400, img, width = 500 },
  forwardedRef,
) {
  const imageRef = useRef<HTMLImageElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<
    | {
        handle: ResizeHandle | undefined
        origin: Rect
        pointerX: number
        pointerY: number
      }
    | undefined
  >(undefined)
  const ratio = parseRatio(aspectRatio)
  const [imageSize, setImageSize] = useState({ height, width })
  const [crop, setCrop] = useState<Rect>(() => initialCrop(width, height, ratio))

  useEffect(() => {
    const image = new Image()
    image.addEventListener('load', () => {
      const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight, 1)
      const nextSize = {
        height: image.naturalHeight * scale,
        width: image.naturalWidth * scale,
      }
      setImageSize(nextSize)
      setCrop(initialCrop(nextSize.width, nextSize.height, ratio))
    })
    image.src = img
  }, [height, img, ratio, width])

  useImperativeHandle(
    forwardedRef,
    () => ({
      async getCropImage(
        type = 'image/jpeg',
        quality = 0.92,
        output = 'base64',
        targetWidth,
        targetHeight,
      ) {
        const image = imageRef.current
        if (!image?.naturalWidth || !image.naturalHeight) {
          throw new Error('Cropper image is not ready')
        }
        const sourceX = (crop.x / imageSize.width) * image.naturalWidth
        const sourceY = (crop.y / imageSize.height) * image.naturalHeight
        const sourceWidth = (crop.width / imageSize.width) * image.naturalWidth
        const sourceHeight = (crop.height / imageSize.height) * image.naturalHeight
        const canvas = document.createElement('canvas')
        canvas.width = Math.max(1, Math.round(targetWidth ?? sourceWidth))
        canvas.height = Math.max(1, Math.round(targetHeight ?? sourceHeight))
        canvas
          .getContext('2d')
          ?.drawImage(
            image,
            sourceX,
            sourceY,
            sourceWidth,
            sourceHeight,
            0,
            0,
            canvas.width,
            canvas.height,
          )
        const safeQuality = clamp(quality, 0, 1)
        if (output === 'base64') return canvas.toDataURL(type, safeQuality)
        return await new Promise<Blob>((resolve, reject) =>
          canvas.toBlob(
            (blob) => (blob ? resolve(blob) : reject(new Error('Failed to create crop blob'))),
            type,
            safeQuality,
          ),
        )
      },
    }),
    [crop, imageSize.height, imageSize.width],
  )

  function pointerDelta(event: ReactPointerEvent) {
    const bounds = stageRef.current?.getBoundingClientRect()
    return bounds
      ? {
          x:
            ((event.clientX - (dragRef.current?.pointerX ?? event.clientX)) / bounds.width) *
            imageSize.width,
          y:
            ((event.clientY - (dragRef.current?.pointerY ?? event.clientY)) / bounds.height) *
            imageSize.height,
        }
      : { x: 0, y: 0 }
  }

  function resize(origin: Rect, handle: ResizeHandle, dx: number, dy: number): Rect {
    let left = origin.x
    let top = origin.y
    let right = origin.x + origin.width
    let bottom = origin.y + origin.height
    if (handle.includes('w')) left = clamp(origin.x + dx, 0, right - MIN_CROP_SIZE)
    if (handle.includes('e')) right = clamp(right + dx, left + MIN_CROP_SIZE, imageSize.width)
    if (handle.includes('n')) top = clamp(origin.y + dy, 0, bottom - MIN_CROP_SIZE)
    if (handle.includes('s')) bottom = clamp(bottom + dy, top + MIN_CROP_SIZE, imageSize.height)

    if (ratio) {
      const horizontal = handle === 'e' || handle === 'w' || Math.abs(dx) >= Math.abs(dy)
      if (horizontal) {
        const nextHeight = (right - left) / ratio
        if (handle.includes('n')) top = bottom - nextHeight
        else if (handle.includes('s')) bottom = top + nextHeight
        else {
          const center = origin.y + origin.height / 2
          top = center - nextHeight / 2
          bottom = center + nextHeight / 2
        }
      } else {
        const nextWidth = (bottom - top) * ratio
        if (handle.includes('w')) left = right - nextWidth
        else if (handle.includes('e')) right = left + nextWidth
        else {
          const center = origin.x + origin.width / 2
          left = center - nextWidth / 2
          right = center + nextWidth / 2
        }
      }
      if (left < 0) {
        right -= left
        left = 0
      }
      if (right > imageSize.width) {
        left -= right - imageSize.width
        right = imageSize.width
      }
      if (top < 0) {
        bottom -= top
        top = 0
      }
      if (bottom > imageSize.height) {
        top -= bottom - imageSize.height
        bottom = imageSize.height
      }
    }
    return { height: bottom - top, width: right - left, x: left, y: top }
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current
    if (!drag) return
    const { x: dx, y: dy } = pointerDelta(event)
    if (drag.handle) {
      setCrop(resize(drag.origin, drag.handle, dx, dy))
      return
    }
    setCrop({
      ...drag.origin,
      x: clamp(drag.origin.x + dx, 0, imageSize.width - drag.origin.width),
      y: clamp(drag.origin.y + dy, 0, imageSize.height - drag.origin.height),
    })
  }

  function beginDrag(event: ReactPointerEvent, handle?: ResizeHandle) {
    event.preventDefault()
    event.stopPropagation()
    stageRef.current?.setPointerCapture(event.pointerId)
    dragRef.current = {
      handle,
      origin: crop,
      pointerX: event.clientX,
      pointerY: event.clientY,
    }
  }

  const handles: ResizeHandle[] = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w']

  return (
    <div className="v-cropper" style={{ maxHeight: height, maxWidth: width }}>
      <div
        className="v-cropper__stage"
        onPointerCancel={() => (dragRef.current = undefined)}
        onPointerMove={onPointerMove}
        onPointerUp={() => (dragRef.current = undefined)}
        ref={stageRef}
        style={{ aspectRatio: `${imageSize.width} / ${imageSize.height}` }}
      >
        <img alt="待裁剪图片" draggable={false} ref={imageRef} src={img} />
        <div className="v-cropper__mask is-top" style={{ height: crop.y }} />
        <div
          className="v-cropper__mask is-left"
          style={{ height: crop.height, top: crop.y, width: crop.x }}
        />
        <div
          className="v-cropper__mask is-right"
          style={{ height: crop.height, left: crop.x + crop.width, top: crop.y }}
        />
        <div className="v-cropper__mask is-bottom" style={{ top: crop.y + crop.height }} />
        <div
          aria-label="裁剪框，可拖动调整位置"
          className="v-cropper__crop-box"
          onPointerDown={(event) => beginDrag(event)}
          role="application"
          style={{ height: crop.height, left: crop.x, top: crop.y, width: crop.width }}
        >
          <span className="v-cropper__grid is-horizontal is-first" />
          <span className="v-cropper__grid is-horizontal is-second" />
          <span className="v-cropper__grid is-vertical is-first" />
          <span className="v-cropper__grid is-vertical is-second" />
          {handles.map((handle) => (
            <button
              aria-label={`调整裁剪框 ${handle}`}
              className={`v-cropper__resize-handle is-${handle}`}
              key={handle}
              onPointerDown={(event) => beginDrag(event, handle)}
              type="button"
            />
          ))}
        </div>
      </div>
    </div>
  )
})
