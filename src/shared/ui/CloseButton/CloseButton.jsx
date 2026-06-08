import React, { memo } from 'react'
import { CloseIcon } from '@shared/assets/icons/CloseIcon'
import classes from './CloseButton.module.css'

export const CloseButton = memo(({ className, onClick, size }) => {
	return (
		<button
			className={`${classes.closeButton} ${className}`}
			style={{ width: size, height: size }}
			onClick={onClick}
		>
			<CloseIcon size={size * 0.6} />
		</button>
	)
})
