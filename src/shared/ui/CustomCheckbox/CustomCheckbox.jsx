import React, { memo } from 'react'
import { CheckIcon } from '@shared/assets/icons/CheckIcon'
import classes from './CustomCheckbox.module.css'

export const CustomCheckbox = memo(({ id, checked, onChange, size = 18 }) => {
	return (
		<div className={classes.checkbox} style={{ width: size, height: size }}>
			<input
				type='checkbox'
				className={`${classes.realCheckbox}`}
				id={id}
				onChange={onChange}
				checked={checked}
			/>
			<label className={classes.customCheckbox} htmlFor={id}>
				<CheckIcon className={classes.checkIcon} size={size * 0.6} />
			</label>
		</div>
	)
})
