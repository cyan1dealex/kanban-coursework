import React, { memo } from 'react'
import { createPortal } from 'react-dom'
import { CloseButton } from '../CloseButton'
import classes from './Modal.module.css'

export const Modal = memo(({ children, onClose }) => {
	return createPortal(
		<div className={classes.modalWrapper}>
			<div onClick={onClose} className={classes.modalOverlay}></div>
			<div className={classes.modalContent}>
				{children}
				<CloseButton
					className={classes.modalCloseButton}
					onClick={onClose}
					size={40}
				/>
			</div>
		</div>,
		document.body,
	)
})
