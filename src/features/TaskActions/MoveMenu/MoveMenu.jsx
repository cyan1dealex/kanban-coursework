import React, {
	useContext,
	useEffect,
	useState,
	useMemo,
	useCallback,
	memo,
} from 'react'
import { BoardContext } from '@entities/BoardData/BoardContext'
import { useParams } from 'react-router-dom'
import classes from './MoveMenu.module.css'
import { MenuContentLayout } from '@shared/ui/MenuContentLayout'
import { Dropdown } from '@shared/ui/Dropdown'
import { UIContext } from '@shared/model/UIContext'

export const MoveMenu = memo(({ task, columnId }) => {
	const { boardsState, moveTask } = useContext(BoardContext)
	const { closeSubMenu, closeMenu } = useContext(UIContext)
	const { boardId } = useParams()

	const [selectedBoardId, setSelectedBoardId] = useState(boardId)
	const [selectedColumnId, setSelectedColumnId] = useState(columnId)

	useEffect(() => {
		const currentBoardColumns = boardsState.boards[selectedBoardId].columnIds
		if (!currentBoardColumns.includes(selectedColumnId)) {
			setSelectedColumnId(currentBoardColumns[0] || null)
			setPosition(1)
		}
	}, [selectedBoardId, boardsState.boards, selectedColumnId])

	const tasksCount = selectedColumnId
		? boardsState.columns[selectedColumnId].taskIds.length
		: 0

	const maxPos = tasksCount + 1

	// ОПТИМИЗАЦИЯ: кэшируем массив позиций
	const positions = useMemo(() => {
		return Array.from({ length: maxPos }, (_, i) => i + 1)
	}, [maxPos])

	const [position, setPosition] = useState(() => {
		return boardsState.columns[selectedColumnId].taskIds.indexOf(task.id) + 1
	})

	// ОПТИМИЗАЦИЯ: кэшируем boardOptions
	const boardOptions = useMemo(() => {
		return Object.keys(boardsState.boards).map(id => ({
			id: id,
			label: `${boardsState.boards[id].title} ${id === boardId ? '(тек.)' : ''}`,
		}))
	}, [boardsState.boards, boardId])

	// ОПТИМИЗАЦИЯ: кэшируем columnOptions
	const columnOptions = useMemo(() => {
		return boardsState.boards[selectedBoardId].columnIds.map(id => ({
			id: id,
			label: boardsState.columns[id].title,
		}))
	}, [boardsState.boards, boardsState.columns, selectedBoardId])

	// ОПТИМИЗАЦИЯ: стабилизируем экшен перемещения
	const handleMove = useCallback(() => {
		moveTask(task, columnId, selectedColumnId, position)
		closeMenu()
	}, [moveTask, task, columnId, selectedColumnId, position, closeMenu])

	return (
		<MenuContentLayout title={'Перемещение карточки'} onClose={closeSubMenu}>
			<div className={classes.moveMenu}>
				<div className={classes.moveMenuBoard}>
					<p className={classes.moveMenuBoardDropdownTitle}>Доска</p>
					<Dropdown
						title={boardsState.boards[selectedBoardId].title}
						options={boardOptions}
						onSelect={setSelectedBoardId}
					/>
				</div>
				<div className={classes.moveMenuListPositionBlock}>
					<div className={classes.moveMenuList}>
						<p className={classes.moveMenuListDropdownTitle}>Список</p>
						<Dropdown
							title={boardsState.columns[selectedColumnId].title}
							options={columnOptions}
							onSelect={setSelectedColumnId}
						/>
					</div>
					<div className={classes.moveMenuPosition}>
						<p className={classes.moveMenuPositionDropdownTitle}>Позиция</p>
						<Dropdown
							title={position}
							options={positions}
							onSelect={setPosition}
						/>
					</div>
				</div>
				<button onClick={handleMove} className={classes.moveMenuButton}>
					Переместить карточку
				</button>
			</div>
		</MenuContentLayout>
	)
})
