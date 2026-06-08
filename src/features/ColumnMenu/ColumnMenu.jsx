import React, {
	useContext,
	useEffect,
	useRef,
	useState,
	useCallback,
	memo,
} from 'react'
import classes from './ColumnMenu.module.css'
import { BoardContext } from '@entities/BoardData/BoardContext'
import { UIContext } from '@shared/model/UIContext'
import { Textarea } from '@shared/ui/Textarea'

export const ColumnMenu = memo(({ boardId, columnId, position }) => {
	const { boardsState, updateColumnTitle, removeColumn } =
		useContext(BoardContext)
	const { closeMenu } = useContext(UIContext)

	const column = boardsState.columns[columnId]
	const [columnTitle, setColumnTitle] = useState(column.title)
	const textAreaRef = useRef()

	useEffect(() => {
		if (textAreaRef.current) {
			textAreaRef.current.select()
		}
	}, [])

	const handleSave = useCallback(() => {
		updateColumnTitle(columnId, columnTitle)
		closeMenu()
	}, [columnId, columnTitle, updateColumnTitle, closeMenu])

	const handleDelete = useCallback(() => {
		removeColumn(boardId, columnId)
		closeMenu()
	}, [boardId, columnId, removeColumn, closeMenu])

	return (
		<div className={classes.columnMenuWrapper}>
			<div
				className={classes.columnMenuContent}
				style={{ width: position.width }}
			>
				<Textarea
					ref={textAreaRef}
					className={classes.columnMenuTextarea}
					placeholder={'Название колонки'}
					value={columnTitle}
					onChange={e => setColumnTitle(e.target.value)}
				/>
				<button className={classes.columnMenuSaveButton} onClick={handleSave}>
					Сохранить
				</button>
			</div>
			<div className={classes.columnMenuSideActions}>
				<button className={classes.actionButton} onClick={handleDelete}>
					Удалить колонку
				</button>
			</div>
		</div>
	)
})
