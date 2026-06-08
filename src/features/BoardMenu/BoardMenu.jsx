import React, { useContext, useState, useCallback, memo } from 'react'
import { BoardContext } from '@entities/BoardData/BoardContext'
import { UIContext } from '@shared/model/UIContext'
import classes from './BoardMenu.module.css'
import { InlineInput } from '@shared/ui/InlineInput/InlineInput'

export const BoardMenu = memo(({ boardId, position }) => {
	const { boardsState, renameBoardTitle, removeBoard } =
		useContext(BoardContext)
	const { closeMenu } = useContext(UIContext)

	const board = boardsState.boards[boardId]
	const [boardTitle, setBoardTitle] = useState(board.title)

	const handleSubmit = useCallback(() => {
		renameBoardTitle(boardId, boardTitle)
		closeMenu()
	}, [boardId, boardTitle, renameBoardTitle, closeMenu])

	const handleCancel = useCallback(() => {
		setBoardTitle(board.title)
		closeMenu()
	}, [board.title, closeMenu])

	const handleDelete = useCallback(() => {
		removeBoard(boardId)
		closeMenu()
	}, [boardId, removeBoard, closeMenu])

	return (
		<div className={classes.boardMenuWrapper}>
			<div className={classes.boardMenuContent}>
				<div
					className={classes.boardMenuInputWrapper}
					style={{ height: position.height }}
				>
					<InlineInput
						className={classes.boardMenuInput}
						placeholder={'Название доски'}
						value={boardTitle}
						onChange={e => setBoardTitle(e.target.value)}
						onEnter={handleSubmit}
						onEscape={handleCancel}
					/>
				</div>
			</div>
			<div className={classes.boardMenuSideActions}>
				<button className={classes.boardMenuSaveButton} onClick={handleSubmit}>
					Сохранить
				</button>
				<button className={classes.actionButton} onClick={handleDelete}>
					Удалить доску
				</button>
			</div>
		</div>
	)
})
