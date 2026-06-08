import React, { memo } from 'react'
import { MenuDotsIcon } from '@shared/assets/icons/MenuDotsIcon'
import classes from './MenuDotsButton.module.css'

export const MenuDotsButton = memo(({ onClick, className }) => {
	return (
		<button className={`${classes.menuButton} ${className}`} onClick={onClick}>
			<MenuDotsIcon />
		</button>
	)
})
