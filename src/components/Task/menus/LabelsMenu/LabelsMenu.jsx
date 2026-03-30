import React, { useContext, useState } from 'react'
import classes from './LabelsMenu.module.css'
import { BoardContext } from '../../../../context/BoardContext'

const LabelsMenu = ({ task }) => {
	const { boardsState, openSubMenu, toggleLabel, closeSubMenu } =
		useContext(BoardContext)
	const { labels } = boardsState

	return (
		<div className={classes.labelsMenu}>
			<h2 className={classes.labelsMenuTitle}>Метки</h2>

			<div className={classes.labelsMenuList}>
				{Object.values(labels).map(label => (
					<div key={label.id} className={classes.labelsMenuItem}>
						<input
							id={`labelMenuCheckbox-${label.id}`}
							type='checkbox'
							className={classes.labelsMenuCheckbox}
							checked={task.labelIds?.includes(label.id) || false}
							onChange={() => {
								toggleLabel(task.id, label.id)
							}}
						/>

						<label
							htmlFor={`labelMenuCheckbox-${label.id}`}
							className={classes.labelsMenuPill}
							style={{ backgroundColor: label.color }}
						>
							<span className={classes.labelsMenuPillTitle}>{label.title}</span>
						</label>

						<button
							onClick={() => openSubMenu('editLabel', null, label)}
							className={classes.labelsMenuEditButton}
						>
							⚙
						</button>
					</div>
				))}
			</div>

			<button
				className={classes.labelsMenuCreateButton}
				onClick={() => {
					openSubMenu('createLabel')
				}}
			>
				+ Создать метку
			</button>
			<button onClick={closeSubMenu} className={classes.closeLabelsMenuButton}>
				x
			</button>
		</div>
	)
}

export default LabelsMenu
