import React, { memo } from 'react'
import classes from './MenuContentLayout.module.css'
import { CloseButton } from '../CloseButton'

export const MenuContentLayout = memo(
	({ children, title, onBack = null, onClose }) => {
		return (
			<div className={classes.menuContentLayout}>
				<header className={classes.menuContentLayoutHeader}>
					{onBack && (
						<button
							onClick={onBack}
							className={classes.menuContentLayoutBackButton}
						>
							⬅
						</button>
					)}

					<h2 className={classes.menuContentLayoutTitle}>{title}</h2>

					{onClose && (
						<CloseButton
							className={classes.menuContentLayoutCloseButton}
							onClick={onClose}
							size={32}
						/>
					)}
				</header>

				{children}
			</div>
		)
	},
)
