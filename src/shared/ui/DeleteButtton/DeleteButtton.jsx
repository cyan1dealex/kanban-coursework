import React, { memo } from 'react'
import { DeleteIcon } from '@shared/assets/icons/DeleteIcon'
import classes from './DeleteButtton.module.css'

export const DeleteButtton = memo(({ className, onClick, size }) => {
	return (
		<button
			className={`${classes.deleteButton} ${className}`}
			onClick={onClick}
			style={{ width: size, height: size }}
		>
			<DeleteIcon size={size * 0.6} />
		</button>
	)
})
