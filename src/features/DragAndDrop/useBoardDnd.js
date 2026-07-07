import { useState, useCallback } from 'react'
import { arrayMove } from '@dnd-kit/sortable'

export const useBoardDnd = (boardId, setBoardsState) => {
	const [activeTask, setActiveTask] = useState(null)
	const [activeColumn, setActiveColumn] = useState(null)

	const handleDragStart = useCallback(({ active }) => {
		if (active.data.current?.type === 'task') setActiveTask(active)
		if (active.data.current?.type === 'column') setActiveColumn(active)
	}, [])

	const handleDragOver = useCallback(
		event => {
			const { active, over } = event
			if (!over) return

			const activeType = active.data.current?.type
			const overType = over.data.current?.type

			const activeId = active.id
			const overId = over.id

			// Перемещение колонок на лету
			if (activeType === 'column') {
				// Если навели на карточку, берем ID её колонки, иначе берем ID самой колонки
				const targetColumnId =
					overType === 'task' ? over.data.current?.columnId : over.id

				if (!targetColumnId || activeId === targetColumnId) return

				setBoardsState(prev => {
					const currentBoard = prev.boards[boardId]
					if (!currentBoard) return prev

					const oldIndex = currentBoard.columnIds.indexOf(activeId)
					const newIndex = currentBoard.columnIds.indexOf(targetColumnId)

					if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex)
						return prev

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
				return
			}

			// Перемещение карточек на лету
			if (activeType === 'task') {
				const fromColumnId = active.data.current?.columnId
				const toColumnId =
					overType === 'task' ? over.data.current?.columnId : over.id

				if (!fromColumnId || !toColumnId) return

				setBoardsState(prev => {
					// Внутри одной и той же колонки
					if (fromColumnId === toColumnId) {
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
					}

					// Между разными колонками
					const oldColumn = prev.columns[fromColumnId]
					const newColumn = prev.columns[toColumnId]
					if (!oldColumn || !newColumn || newColumn.taskIds.includes(activeId))
						return prev

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
			}
		},
		[boardId, setBoardsState],
	)

	const handleDragEnd = useCallback(() => {
		setActiveTask(null)
		setActiveColumn(null)
	}, [])

	return {
		activeTask,
		activeColumn,
		handleDragStart,
		handleDragOver,
		handleDragEnd,
	}
}
