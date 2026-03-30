import React, { useContext, useEffect, useRef, useState } from 'react'
import classes from './MoveMenu.module.css'
import { BoardContext } from '../../../../context/BoardContext'
import { useParams } from 'react-router-dom'

const MoveMenu = ({ task, columnId }) => {
	const { boardsState, closeContextMenu, closeSubMenu, moveTask } =
		useContext(BoardContext)

	const { boardId } = useParams()

	const [selectedBoardId, setSelectedBoardId] = useState(boardId)
	const [selectedColumnId, setSelectedColumnId] = useState(columnId)

	const tasksCount = boardsState.columns[selectedColumnId].taskIds.length
	const maxPos = tasksCount + 1
	const positions = Array.from({ length: maxPos }, (_, i) => i + 1)

	const [position, setPosition] = useState(
		boardsState.columns[selectedColumnId].taskIds.indexOf(task.id) + 1,
	)

	const boardIds = Object.keys(boardsState.boards)
	const columnIds = boardsState.boards[selectedBoardId].columnIds

	return (
		<div className={classes.moveMenu}>
			<h2 className={classes.moveMenuTitle}>Перемещение карточки</h2>
			<div className={classes.moveMenuBoard}>
				<p className={classes.moveMenuBoardDropdownTitle}>Доска</p>
				<select
					className={classes.moveMenuBoardDropdown}
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
								className={classes.moveMenuBoardDropdownOption}
							>
								{boardTitle} {id === boardId ? '(текущая)' : ''}
							</option>
						)
					})}
				</select>
			</div>
			<div className={classes.moveMenuListPositionBlock}>
				<div className={classes.moveMenuList}>
					<p className={classes.moveMenuListDropdownTitle}>Список</p>
					<select
						className={classes.moveMenuListDropdown}
						value={selectedColumnId}
						onChange={e => setSelectedColumnId(e.target.value)}
					>
						{columnIds.map(id => {
							const columnTitle = boardsState.columns[id].title
							return (
								<option
									key={id}
									value={id}
									className={classes.moveMenuListDropdownOption}
								>
									{columnTitle}
								</option>
							)
						})}
					</select>
				</div>
				<div className={classes.moveMenuPosition}>
					<p className={classes.moveMenuPositionDropdownTitle}>Позиция</p>
					<select
						className={classes.moveMenuPositionDropdown}
						value={position}
						onChange={e => setPosition(e.target.value)}
					>
						{positions.map(id => {
							return (
								<option
									key={id}
									value={id}
									className={classes.moveMenuPositionDropdownOption}
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
					moveTask(task, columnId, selectedColumnId, position)
					closeContextMenu()
				}}
				className={classes.moveMenuButton}
			>
				Переместить карточку
			</button>
			<button onClick={closeSubMenu} className={classes.closeMoveMenuButton}>
				x
			</button>
		</div>
	)
}

export default MoveMenu
