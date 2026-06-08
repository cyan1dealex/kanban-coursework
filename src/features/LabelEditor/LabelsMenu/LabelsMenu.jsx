import React, { useContext, useCallback, memo } from 'react'
import { BoardContext } from '@entities/BoardData/BoardContext'
import classes from './LabelsMenu.module.css'
import { CustomCheckbox } from '@shared/ui/CustomCheckbox/CustomCheckbox'
import { EditButton } from '@shared/ui/EditButton/EditButton'
import { MenuContentLayout } from '@shared/ui/MenuContentLayout/MenuContentLayout'
import { UIContext } from '@shared/model/UIContext'

export const LabelsMenu = memo(({ task }) => {
	if (!task) return null

	const { boardsState, toggleLabel } = useContext(BoardContext)
	const { uiState, toggleSubMenu, closeSubMenu } = useContext(UIContext)

	const { labels } = boardsState
	const isLabelsLimitReached = Object.values(labels).length >= 9

	const handleOpenLabelEditing = useCallback(
		(e, label) => {
			e.stopPropagation()

			toggleSubMenu('editLabel', uiState.subMenu.position, {
				label: label,
				taskId: task.id,
			})
		},
		[toggleSubMenu, uiState.subMenu?.position, task.id],
	)

	const handleOpenLabelCreate = useCallback(
		e => {
			e.stopPropagation()

			toggleSubMenu('createLabel', uiState.subMenu.position, {
				taskId: task.id,
			})
		},
		[toggleSubMenu, uiState.subMenu?.position, task.id],
	)

	return (
		<MenuContentLayout title={'Метки'} onClose={closeSubMenu}>
			<div className={classes.labelsMenuList}>
				{Object.values(labels).map(label => (
					<div key={label.id} className={classes.labelsMenuItem}>
						<CustomCheckbox
							id={`labelMenuCheckbox-${label.id}`}
							checked={task.labelIds?.includes(label.id) || false}
							onChange={() => {
								toggleLabel(task.id, label.id)
							}}
						/>
						<label
							htmlFor={`labelMenuCheckbox-${label.id}`}
							className={classes.labelsMenuPill}
							style={{ color: label.color }}
						>
							<span>{label.title}</span>
						</label>

						<EditButton
							onClick={e => handleOpenLabelEditing(e, label)}
							className={classes.labelsMenuEditButton}
						/>
					</div>
				))}
			</div>

			<button
				className={classes.labelsMenuCreateButton}
				disabled={isLabelsLimitReached}
				onClick={handleOpenLabelCreate}
			>
				{isLabelsLimitReached ? 'Превышен лимит меток' : '+ Создать метку'}
			</button>
		</MenuContentLayout>
	)
})
