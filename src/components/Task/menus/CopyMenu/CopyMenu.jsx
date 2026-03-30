import React, { useContext, useEffect, useRef, useState } from 'react'
import classes from './CopyMenu.module.css'
import { BoardContext } from '../../../../context/BoardContext'
import { useParams } from 'react-router-dom'

const CopyMenu = ({ task, columnId }) => {
	const { boardsState, copyTask, closeContextMenu, closeSubMenu } =
		useContext(BoardContext)

	const { boardId } = useParams()

	const [text, setText] = useState(task.text)
	const [selectedBoardId, setSelectedBoardId] = useState(boardId)
	const [selectedColumnId, setSelectedColumnId] = useState(columnId)

	const tasksCount = boardsState.columns[selectedColumnId].taskIds.length
	const maxPos = tasksCount + 1
	const positions = Array.from({ length: maxPos }, (_, i) => i + 1)

	const [position, setPosition] = useState(
		boardsState.columns[selectedColumnId].taskIds.indexOf(task.id) + 1,
	)
	const textAreaRef = useRef(null)

	const boardIds = Object.keys(boardsState.boards)
	const columnIds = boardsState.boards[selectedBoardId].columnIds

	useEffect(() => {
		if (textAreaRef.current) {
			textAreaRef.current.select()
		}
	}, [])

	const handleInput = e => {
		setText(e.target.value)

		const el = e.target
		el.style.height = 'auto'
		el.style.height = el.scrollHeight + 'px'
	}

	return (
		<div className={classes.copyMenu}>
			<h2 className={classes.copyMenuTitle}>Копирование карточки</h2>
			<div className={classes.copyMenuNameBlock}>
				<p className={classes.copyMenuNameTitle}>Имя</p>

				<textarea
					ref={textAreaRef}
					className={classes.copyMenuTextarea}
					value={text}
					onChange={handleInput}
				/>
			</div>
			<p className={classes.copyMenuLabel}>Копировать в...</p>
			<div className={classes.copyMenuBoard}>
				<p className={classes.copyMenuBoardDropdownTitle}>Доска</p>
				<select
					className={classes.copyMenuBoardDropdown}
					value={selectedBoardId}
					onChange={e => {
						setSelectedBoardId(e.target.value)
					}}
				>
					{boardIds.map(id => {
						const boardTitle = boardsState.boards[id].title
						return (
							<option
								key={id}
								value={id}
								className={classes.copyMenuBoardDropdownOption}
							>
								{boardTitle} {id === boardId ? '(текущая)' : ''}
							</option>
						)
					})}
				</select>
			</div>
			<div className={classes.copyMenuListPositionBlock}>
				<div className={classes.copyMenuList}>
					<p className={classes.copyMenuListDropdownTitle}>Список</p>
					<select
						className={classes.copyMenuListDropdown}
						value={selectedColumnId}
						onChange={e => setSelectedColumnId(e.target.value)}
					>
						{columnIds.map(id => {
							const columnTitle = boardsState.columns[id].title
							return (
								<option
									key={id}
									value={id}
									className={classes.copyMenuListDropdownOption}
								>
									{columnTitle}
								</option>
							)
						})}
					</select>
				</div>
				<div className={classes.copyMenuPosition}>
					<p className={classes.copyMenuPositionDropdownTitle}>Позиция</p>
					<select
						className={classes.copyMenuPositionDropdown}
						value={position}
						onChange={e => setPosition(e.target.value)}
					>
						{positions.map(id => {
							return (
								<option
									key={id}
									value={id}
									className={classes.copyMenuPositionDropdownOption}
								>
									{id}
								</option>
							)
						})}
					</select>
				</div>
			</div>
			<button
				onClick={() => {
					copyTask(task, text, selectedColumnId, position)
					closeContextMenu()
				}}
				className={classes.copyMenuButton}
			>
				Создать карточку
			</button>
			<button onClick={closeSubMenu} className={classes.closeCopyMenuButton}>
				x
			</button>
		</div>
	)
}

export default CopyMenu
