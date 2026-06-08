import React, { memo } from 'react'
import classes from './FilterButton.module.css'

export const FilterButton = memo(({ onClick, className }) => {
	return (
		<button
			className={`${classes.filterButton} ${className}`}
			onClick={onClick}
		>
			Фильтры
		</button>
	)
})
