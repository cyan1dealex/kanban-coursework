import React, { memo } from 'react'
import { EditIcon } from '@shared/assets/icons/EditIcon'
import classes from './EditButton.module.css'

export const EditButton = memo(({ onClick, className }) => {
	return (
		<button className={`${classes.editButton} ${className}`} onClick={onClick}>
			<EditIcon />
		</button>
	)
})
