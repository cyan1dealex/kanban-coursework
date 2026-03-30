import React, { useContext, useEffect, useRef, useState } from 'react'
import classes from './ContextMenu.module.css'
import { BoardContext } from '../../../context/BoardContext'
import { createPortal } from 'react-dom'

const ContextMenu = ({children, position, onClose, isSubMenu}) => {
	return createPortal(
		<div className={classes.contextMenuWrapper} >
			{!isSubMenu && <div 
				className={classes.contextMenuOverlay} 
				onClick={onClose}
			/>}
			
			<div 
				className={classes.contextMenuContent} 
				style={{
					top: position.top,
					left: position.left,
				}}
			>
				{children}
			</div>
		</div>,
		document.body
	)
}

export default ContextMenu