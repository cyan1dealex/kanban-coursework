import React, { useRef, useState, memo } from 'react'
import classes from './Dropdown.module.css'
import { useOnClickOutside } from '@shared/hooks/useOnClickOutside'

export const Dropdown = memo(({ title, options, onSelect, style }) => {
	const [isOpen, setIsOpen] = useState(false)

	const dropdownRef = useRef(null)

	useOnClickOutside(dropdownRef, () => setIsOpen(false))

	return (
		<div className={classes.dropdownWrapper} ref={dropdownRef}>
			<div
				className={classes.dropdownTrigger}
				onClick={() => setIsOpen(!isOpen)}
				style={style}
			>
				<p className={classes.dropdownTitle}>{title}</p>

				<span
					className={`${classes.dropdownIcon} ${isOpen ? classes.opened : ''}`}
				></span>
			</div>
			{isOpen && (
				<div className={classes.dropdownMenu}>
					{options.map(option => (
						<div
							key={option.id || option}
							className={classes.dropdownMenuItem}
							onClick={() => {
								onSelect(option.id || option)
								setIsOpen(false)
							}}
						>
							{option.label || option}
						</div>
					))}
				</div>
			)}
		</div>
	)
})
