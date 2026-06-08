import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import classes from './Logo.module.css'

export const Logo = memo(({ className }) => {
	return (
		<Link to='/' className={`${classes.logoWrapper} ${className || ''}`}>
			<svg
				xmlns='http://www.w3.org/2000/svg'
				viewBox='0 0 24 24'
				fill='none'
				stroke='currentColor'
				strokeWidth='1.5'
				strokeLinecap='round'
				strokeLinejoin='round'
				className={classes.logoIcon}
				aria-hidden='true'
			>
				<rect width='20' height='8' x='2' y='2' rx='2' ry='2' />
				<rect width='20' height='8' x='2' y='14' rx='2' ry='2' />
				<rect width='20' height='8' x='2' y='14' rx='2' ry='2' />
			</svg>
		</Link>
	)
})
