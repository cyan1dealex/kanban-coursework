import { useState, useLayoutEffect } from 'react'

const PADDING = 12

export const usePopoverPosition = (
	popoverRef,
	position,
	repositionMode = 'shift',
) => {
	const [safeCoords, setSafeCoords] = useState({
		left: position?.left || 0,
		top: position?.top || 0,
		maxHeight: 'none',
		maxWidth: 'none',
	})

	const [isVisible, setIsVisible] = useState(false)

	useLayoutEffect(() => {
		if (!popoverRef.current || !position) return

		// Сброс ограничения перед замером
		popoverRef.current.style.maxHeight = 'none'
		popoverRef.current.style.maxWidth = 'none'

		const rect = popoverRef.current.getBoundingClientRect()

		let newLeft = position.left
		let newTop = position.top
		let newMaxHeight = 'none'
		let newMaxWidth = 'none'

		const viewportTop = newTop - window.scrollY
		const viewportLeft = newLeft - window.scrollX

		// Защита от вылета за правый край
		if (viewportLeft + rect.width > window.innerWidth - PADDING) {
			newLeft = window.innerWidth + window.scrollX - rect.width - PADDING
		}
		// Защита от вылета за левый край (имеет больший приоритет)
		if (newLeft - window.scrollX < PADDING) {
			newLeft = window.scrollX + PADDING
		}

		// Если экран слишком узкий, жестко обрезаем ширину
		const shiftedViewportLeft = newLeft - window.scrollX
		if (shiftedViewportLeft + rect.width > window.innerWidth - PADDING) {
			newMaxWidth = `${window.innerWidth - shiftedViewportLeft - PADDING}px`
		}

		if (repositionMode === 'shift') {
			// РЕЖИМ SHIFT: Пытаемся сдвинуть меню вверх, чтобы оно влезло целиком
			if (viewportTop + rect.height > window.innerHeight - PADDING) {
				newTop = window.innerHeight + window.scrollY - rect.height - PADDING
			}
			// Если после сдвига вверх оно вылетело за верхний край - прижимаем к верху и обрезаем
			if (newTop - window.scrollY < PADDING) {
				newTop = window.scrollY + PADDING
				newMaxHeight = `${window.innerHeight - PADDING * 2}px`
			}
		} else if (repositionMode === 'crop') {
			// РЕЖИМ CROP: Жестко держим начальную позицию, обрезаем низ
			const spaceBelow = window.innerHeight - viewportTop - PADDING
			if (rect.height > spaceBelow) {
				newMaxHeight = `${Math.max(spaceBelow, 100)}px`
			}
		} else if (repositionMode === 'scroll') {
			// РЕЖИМ SCROLL: Оставляем координаты в покое, мягко скроллим саму страницу
			let scrollY = 0
			let scrollX = 0

			const viewportBottom = viewportTop + rect.height
			if (viewportBottom > window.innerHeight) {
				scrollY = viewportBottom - window.innerHeight + PADDING
			}

			// Проверка скролла по горизонтали на случай, если меню невероятно широкое
			const viewportRight = viewportLeft + rect.width
			if (viewportRight > window.innerWidth) {
				scrollX = viewportRight - window.innerWidth + PADDING
			}

			if (scrollY > 0 || scrollX > 0) {
				window.scrollBy({
					top: scrollY,
					left: scrollX,
					behavior: 'smooth',
				})
			}
		}

		setSafeCoords({
			left: newLeft,
			top: newTop,
			maxHeight: newMaxHeight,
			maxWidth: newMaxWidth,
		})
		setIsVisible(true)
	}, [position, repositionMode, popoverRef])

	return { safeCoords, isVisible }
}
