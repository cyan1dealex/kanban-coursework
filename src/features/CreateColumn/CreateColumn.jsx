import { BoardContext } from '@entities/BoardData/BoardContext'
import { useOnClickOutside } from '@shared/hooks/useOnClickOutside'
import React, {
	useContext,
	useEffect,
	useRef,
	useState,
	useCallback,
	memo,
} from 'react'
import classes from './CreateColumn.module.css'
import { Textarea } from '@shared/ui/Textarea'

export const CreateColumn = memo(({ boardId }) => {
	const { addColumn } = useContext(BoardContext)

	const [newTitle, setNewTitle] = useState('')
	const [isAddingColumn, setIsAddingColumn] = useState(false)

	const inputRef = useRef(null)
	const addColumnRef = useRef(null)

	useEffect(() => {
		if (isAddingColumn && inputRef.current) {
			inputRef.current.focus()
		}
	}, [isAddingColumn])

	const handleSubmit = useCallback(() => {
		if (!newTitle.trim()) {
			setIsAddingColumn(false)
			return
		}

		if (inputRef.current) {
			inputRef.current.blur()
		}

		addColumn(boardId, newTitle.trim())
		setNewTitle('')

		setTimeout(() => {
			if (inputRef.current) inputRef.current.focus()
		}, 0)
	}, [newTitle, boardId, addColumn])

	const handleCancel = useCallback(() => {
		setNewTitle('')
		setIsAddingColumn(false)
	}, [])

	useOnClickOutside(addColumnRef, handleCancel)

	if (isAddingColumn) {
		return (
			<div className={classes.addColumn}>
				<div className={classes.addColumnInner} ref={addColumnRef}>
					<Textarea
						ref={inputRef}
						className={classes.addColumnInput}
						placeholder={'Название колонки'}
						value={newTitle}
						onChange={e => setNewTitle(e.target.value)}
						onEnter={handleSubmit}
						onEscape={handleCancel}
					/>
					<div className={classes.addColumnNav}>
						<button className={classes.addColumnButton} onClick={handleSubmit}>
							Добавить
						</button>
						<button
							className={classes.addColumnCancelButton}
							onClick={handleCancel}
						>
							Отмена
						</button>
					</div>
				</div>
			</div>
		)
	}

	return (
		<button
			className={classes.addColumnPrevButton}
			onClick={() => setIsAddingColumn(true)}
		>
			+ Добавить колонку
		</button>
	)
})
