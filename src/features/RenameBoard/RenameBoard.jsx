import { BoardContext } from '@entities/BoardData/BoardContext'
import React, { useContext, useState, useCallback, memo } from 'react'
import classes from './RenameBoard.module.css'
import { InlineInput } from '@shared/ui/InlineInput/InlineInput'

export const RenameBoard = memo(({ board }) => {
	const { renameBoardTitle } = useContext(BoardContext)

	const [isEditing, setIsEditing] = useState(false)
	const [text, setText] = useState(board.title)

	const handleSubmit = useCallback(() => {
		if (!text.trim()) return

		renameBoardTitle(board.id, text.trim())
		setIsEditing(false)
	}, [board.id, text, renameBoardTitle])

	const handleCancel = useCallback(() => {
		setIsEditing(false)
		setText(board.title)
	}, [board.title])

	if (isEditing) {
		return (
			<div className={classes.boardTitleEditingContainer}>
				<InlineInput
					value={text}
					onChange={e => setText(e.target.value)}
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
		<h2 onClick={() => setIsEditing(true)} className={classes.boardTitle}>
			{board.title}
		</h2>
	)
})
