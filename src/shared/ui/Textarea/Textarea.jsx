import React, { useEffect, useLayoutEffect, useCallback, memo } from 'react'
import classes from './Textarea.module.css'

export const Textarea = memo(
	({
		ref,
		className,
		placeholder,
		value,
		onChange,
		onBlur,
		onEnter,
		onEscape,
	}) => {
		const adjustHeight = useCallback(() => {
			const el = ref.current
			if (el) {
				el.style.height = '0px'
				el.style.height = `${el.scrollHeight}px`
			}
		}, [ref])

		useLayoutEffect(() => {
			adjustHeight()
		}, [value, adjustHeight])

		const handleChange = useCallback(
			e => {
				if (onChange) {
					onChange(e)
				}
				adjustHeight()
			},
			[onChange, adjustHeight],
		)

		const handleKeyDown = useCallback(
			e => {
				if (e.key === 'Enter') {
					if (e.shiftKey) return

					if (onEnter) {
						e.preventDefault()
						onEnter(e)
					}
				}

				if (e.key === 'Escape') {
					if (onEscape) {
						onEscape(e)
					}
				}
			},
			[onEnter, onEscape],
		)

		return (
			<textarea
				ref={ref}
				className={`${classes.textarea} ${className}`}
				placeholder={placeholder}
				value={value}
				onChange={handleChange}
				onBlur={onBlur}
				onKeyDown={handleKeyDown}
			/>
		)
	},
)
