import { useState, useCallback } from 'react'
import { arrayMove } from '@dnd-kit/sortable'

export const useBoardDnd = (boardId, setBoardsState) => {
	const [activeTask, setActiveTask] = useState(null)
	const [activeColumn, setActiveColumn] = useState(null)

	const handleDragStart = useCallback(
		({ active }) => {
			if (active.data.current.type === 'task') {
				setActiveTask(active.id)
			}
			if (active.data.current.type === 'column') {
				setBoardsState(prev => {
					setActiveColumn(prev.columns[active.id])
					return prev
				})
			}
		},
		[setBoardsState],
	)

	const handleDragOver = useCallback(
		event => {
			const { active, over } = event
			if (!over) return

			const activeType = active.data.current.type
			const overType = over.data.current.type

			const activeId = active.id
			const overId = over.id

			const fromColumnId = active.data.current.columnId

			const toColumnId =
				overType === 'task' ? over.data.current.columnId : over.id

			if (activeType !== 'task' || !fromColumnId || !toColumnId) return

			// Внутри одной колонки
			if (fromColumnId === toColumnId) {
				setBoardsState(prev => {
					const column = prev.columns[fromColumnId]
					if (!column) return prev

					const oldIndex = column.taskIds.indexOf(activeId)
					const newIndex = column.taskIds.indexOf(overId)

					if (oldIndex === newIndex || newIndex === -1) return prev

					return {
						...prev,
						columns: {
							...prev.columns,
							[fromColumnId]: {
								...column,
								taskIds: arrayMove(column.taskIds, oldIndex, newIndex),
							},
						},
					}
				})
			}

			// Между колонками
			if (fromColumnId !== toColumnId) {
				setBoardsState(prev => {
					const oldColumn = prev.columns[fromColumnId]
					const newColumn = prev.columns[toColumnId]

					if (!oldColumn || !newColumn) return prev
					if (newColumn.taskIds.includes(activeId)) return prev

					const targetTaskIds = [...newColumn.taskIds]
					const index = targetTaskIds.indexOf(overId)

					const nextIndex =
						overType === 'task' && index >= 0 ? index : targetTaskIds.length
					targetTaskIds.splice(nextIndex, 0, activeId)

					return {
						...prev,
						columns: {
							...prev.columns,
							[fromColumnId]: {
								...oldColumn,
								taskIds: oldColumn.taskIds.filter(id => id !== activeId),
							},
							[toColumnId]: {
								...newColumn,
								taskIds: targetTaskIds,
							},
						},
					}
				})

				active.data.current.columnId = toColumnId
			}
		},
		[setBoardsState],
	)

	const handleDragEnd = useCallback(
		event => {
			const { active, over } = event

			setActiveTask(null)
			setActiveColumn(null)

			if (!over) return

			const activeType = active.data.current.type
			const activeId = active.id
			const overId = over.id

			// Перемещение колонок
			if (activeType === 'column') {
				setBoardsState(prev => {
					const currentBoard = prev.boards[boardId]
					if (!currentBoard) return prev

					const oldIndex = currentBoard.columnIds.indexOf(activeId)
					const newIndex = currentBoard.columnIds.indexOf(overId)

					return {
						...prev,
						boards: {
							...prev.boards,
							[boardId]: {
								...currentBoard,
								columnIds: arrayMove(
									currentBoard.columnIds,
									oldIndex,
									newIndex,
								),
							},
						},
					}
				})
			}
		},
		[boardId, setBoardsState],
	)

	return {
		activeTask,
		setActiveTask,
		activeColumn,
		setActiveColumn,
		handleDragStart,
		handleDragOver,
		handleDragEnd,
	}
}
