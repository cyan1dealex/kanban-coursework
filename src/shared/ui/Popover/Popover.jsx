import React, {
	useLayoutEffect,
	useRef,
	useState,
	useEffect,
	useCallback,
	memo,
} from 'react'
import { createPortal } from 'react-dom'
import { useOnClickOutside } from '@shared/hooks/useOnClickOutside'
import classes from './Popover.module.css'
import { usePopoverPosition } from '@shared/hooks/usePopoverPosition'

export const Popover = memo(
	({
		children,
		position,
		onClose,
		hasOverlay = false,
		isSubMenu = false,
		repositionMode = 'crop', // 'scroll' | 'crop'
	}) => {
		const popoverRef = useRef(null)

		const { safeCoords, isVisible } = usePopoverPosition(
			popoverRef,
			position,
			repositionMode,
		)

		const [showBottomShadow, setShowBottomShadow] = useState(false)

		const checkScroll = useCallback(() => {
			const scrollEl = popoverRef.current?.querySelector(
				`.${classes.contextMenuScrollable}`,
			)
			if (!scrollEl) return

			const { scrollTop, scrollHeight, clientHeight } = scrollEl
			const isScrollable = scrollHeight > clientHeight
			const isNotAtBottom = scrollTop + clientHeight < scrollHeight - 3

			setShowBottomShadow(isScrollable && isNotAtBottom)
		}, [])

		useEffect(() => {
			if (isVisible) {
				const timer = setTimeout(checkScroll, 50)
				return () => clearTimeout(timer)
			}
		}, [isVisible, safeCoords.maxHeight, children, checkScroll])

		const handleClickOutside = useCallback(
			e => {
				if (!isSubMenu) return
				onClose(e)
			},
			[isSubMenu, onClose],
		)

		useOnClickOutside(popoverRef, handleClickOutside)

		if (!position) return null

		return createPortal(
			<div className={classes.contextMenuWrapper}>
				{hasOverlay && (
					<div className={classes.contextMenuOverlay} onClick={onClose} />
				)}

				<div
					ref={popoverRef}
					className={classes.contextMenuContent}
					style={{
						position: 'absolute',
						top: safeCoords.top,
						left: safeCoords.left,
						maxHeight: safeCoords.maxHeight,
						maxWidth: safeCoords.maxWidth,
						display: 'flex',
						flexDirection: 'column',
						opacity: isVisible ? 1 : 0,
					}}
				>
					<div
						className={classes.contextMenuScrollable}
						onScroll={checkScroll}
						style={{
							overflowY: safeCoords.maxHeight !== 'none' ? 'auto' : 'visible',
							overflowX: safeCoords.maxWidth !== 'none' ? 'auto' : 'visible',
							maxHeight: '100%',
							maxWidth: '100%',
							width: '100%',
						}}
					>
						{children}
					</div>

					{showBottomShadow && <div className={classes.bottomShadow} />}
				</div>
			</div>,
			document.body,
		)
	},
)
