import { BoardContext } from '@entities/BoardData/BoardContext'
import { InlineInput } from '@shared/ui/InlineInput/InlineInput'
import React, { useContext, useState, useCallback, memo } from 'react'
import classes from './RenameColumn.module.css'

export const RenameColumn = memo(({ column }) => {
	const { updateColumnTitle } = useContext(BoardContext)
	const [columnTitle, setColumnTitle] = useState(column.title)
	const [isEditing, setIsEditing] = useState(false)

	const handleCancel = useCallback(() => {
		setColumnTitle(column.title)
		setIsEditing(false)
	}, [column.title])

	const handleSubmit = useCallback(() => {
		if (!columnTitle.trim()) {
			handleCancel()
			return
		}

		updateColumnTitle(column.id, columnTitle.trim())
		setIsEditing(false)
	}, [column.id, columnTitle, updateColumnTitle, handleCancel])

	if (isEditing) {
		return (
			<div className={classes.columnEditingContainer}>
				<InlineInput
					value={columnTitle}
					onChange={e => {
						setColumnTitle(e.target.value)
					}}
					onBlur={handleSubmit}
					onEnter={handleSubmit}
					onEscape={handleCancel}
					placeholder={'Название доски'}
					className={classes.inlineText}
				/>
			</div>
		)
	}

	return (
		<h2 onClick={() => setIsEditing(true)} className={classes.columnTitle}>
			{column.title}
		</h2>
	)
})
