import React, { useEffect, useRef, useCallback, memo } from 'react'
import classes from './InlineInput.module.css'

export const InlineInput = memo(
	({ value, onChange, onBlur, onEnter, onEscape, placeholder, className }) => {
		const inputRef = useRef(null)

		useEffect(() => {
			if (inputRef.current) {
				inputRef.current.select()
			}
		}, [])

		const handleKeyDown = useCallback(
			e => {
				if (e.key === 'Enter' && onEnter) {
					e.preventDefault()
					onEnter(e)
				}
				if (e.key === 'Escape' && onEscape) {
					onEscape(e)
				}
			},
			[onEnter, onEscape],
		)

		return (
			<div className={`${classes.wrapper} ${className}`}>
				<span className={classes.hiddenSizer}>{value || placeholder}</span>

				<input
					ref={inputRef}
					type='text'
					className={classes.input}
					value={value}
					onChange={onChange}
					onBlur={onBlur}
					onKeyDown={handleKeyDown}
					placeholder={placeholder}
				/>
			</div>
		)
	},
)
