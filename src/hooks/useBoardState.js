import { useEffect, useRef, useState } from 'react'

const useBoardState = initialData => {
	const [boardsState, setBoardsState] = useState(() => {
		const saved = localStorage.getItem('boards')
		return saved ? JSON.parse(saved) : { ...initialData }
	})

	const [newTitle, setNewTitle] = useState('')
	const [isAddingColumn, setIsAddingColumn] = useState(false)

	const inputRef = useRef(null)

	useEffect(() => {
		if (isAddingColumn && inputRef.current) {
			inputRef.current.focus()
		}
	}, [isAddingColumn])

	useEffect(() => {
		localStorage.setItem('boards', JSON.stringify(boardsState))
	}, [boardsState])

	const addColumn = boardId => {
		if (!newTitle.trim()) return

		const newColumnId = `column-${Date.now()}`

		const newColumn = {
			id: newColumnId,
			boardId: boardId,
			title: newTitle,
			taskIds: [],
		}

		setBoardsState(prev => {
			return {
				...prev,

				boards: {
					...prev.boards,

					[boardId]: {
						...prev.boards[boardId],

						columnIds: [...prev.boards[boardId].columnIds, newColumnId],
					},
				},

				columns: {
					...prev.columns,

					[newColumnId]: newColumn,
				},
			}
		})

		setIsAddingColumn(false)
		setNewTitle('')
	}

	const addTask = (columnIndex, text) => {
		const newTaskId = `task-${Date.now()}`

		const newTask = {
			id: newTaskId,
			text,
		}

		setBoardsState(prev => {
			const column = prev.columns[columnIndex]

			return {
				...prev,

				columns: {
					...prev.columns,

					[columnIndex]: {
						...column,

						taskIds: [...column.taskIds, newTaskId],
					},
				},

				tasks: {
					...prev.tasks,

					[newTaskId]: newTask,
				},
			}
		})
	}

	const removeTask = (columnIndex, taskId) => {
		setBoardsState(prev => {
			const column = prev.columns[columnIndex]

			const newTaskIds = column.taskIds.filter(id => id !== taskId)

			const newTasks = { ...boardsState.tasks }
			delete newTasks[taskId]

			return {
				...prev,

				columns: {
					...prev.columns,

					[columnIndex]: {
						...column,

						taskIds: newTaskIds,
					},
				},

				tasks: newTasks,
			}
		})
	}

	const openContextMenu = (taskId, columnId, ref) => {
		const rect = ref.current.getBoundingClientRect()

		setBoardsState(prev => ({
			...prev,

			ui: {
				...prev.ui,
				menu: {
					taskId: taskId,
					columnId: columnId,
					position: {
						top: rect.top,
						left: rect.right,
						height: rect.height,
						width: rect.width,
					},
				},
			},
		}))
	}

	const closeContextMenu = () => {
		setBoardsState(prev => ({
			...prev,

			ui: {
				...prev.ui,
				menu: {
					taskId: null,
					columnId: null,
					position: null,
				},
				subMenu: {
					type: null,
					position: null,
					data: null,
				},
			},
		}))
	}

	const openSubMenu = (type, ref, data = null) => {
		setBoardsState(prev => {
			const newPosition =
				ref && ref.current
					? {
							top: ref.current.getBoundingClientRect().top,
							left: ref.current.getBoundingClientRect().right + 10,
							rigth: ref.current.getBoundingClientRect().left,
						}
					: prev.ui.subMenu.position

			return {
				...prev,

				ui: {
					...prev.ui,
					subMenu: {
						type,
						position: newPosition,
						data,
					},
				},
			}
		})
	}

	const closeSubMenu = () => {
		setBoardsState(prev => ({
			...prev,

			ui: {
				...prev.ui,
				subMenu: {
					type: null,
					position: null,
					data: null,
				},
			},
		}))
	}

	const updateText = (taskId, newText) => {
		setBoardsState(prev => ({
			...prev,

			tasks: {
				...prev.tasks,
				[taskId]: {
					...prev.tasks[taskId],
					text: newText,
				},
			},
		}))
	}

	const updateColumnTitle = (columnId, newTitle) => {
		setBoardsState(prev => ({
			...prev,

			columns: {
				...prev.columns,
				[columnId]: {
					...prev.columns[columnId],
					title: newTitle,
				},
			},
		}))
	}

	const copyTask = (task, text, columnId, position) => {
		const newTaskId = `task-${Date.now()}`

		const newTask = {
			...task,
			id: newTaskId,
			text,
		}

		setBoardsState(prev => {
			const newTaskIds = [...prev.columns[columnId].taskIds]
			newTaskIds.splice(position - 1, 0, newTaskId)

			return {
				...prev,

				columns: {
					...prev.columns,
					[columnId]: {
						...prev.columns[columnId],
						taskIds: newTaskIds,
					},
				},
				tasks: {
					...prev.tasks,
					[newTaskId]: newTask,
				},
			}
		})
	}

	const moveTask = (task, prevColumnId, targetColumnId, position) => {
		setBoardsState(prev => {
			const prevColumn = prev.columns[prevColumnId]
			const newPrevTaskIds = prevColumn.taskIds.filter(id => id !== task.id)

			const targetColumn = prev.columns[targetColumnId]
			const newTaskIds = [...prev.columns[targetColumnId].taskIds]
			newTaskIds.splice(position - 1, 0, task.id)

			return {
				...prev,

				columns: {
					...prev.columns,

					[prevColumnId]: {
						...prevColumn,

						taskIds: newPrevTaskIds,
					},
					[targetColumnId]: {
						...targetColumn,

						taskIds: newTaskIds,
					},
				},
			}
		})
	}

	const toggleLabel = (taskId, labelId) => {
		setBoardsState(prev => {
			const task = prev.tasks[taskId]

			const currentLabelIds = task.labelIds || []

			const isExist = currentLabelIds.includes(labelId)

			const newLabelIds = isExist
				? currentLabelIds.filter(id => id !== labelId)
				: [...currentLabelIds, labelId]

			return {
				...prev,
				tasks: {
					...prev.tasks,
					[taskId]: {
						...task,
						labelIds: newLabelIds,
					},
				},
			}
		})
	}

	const createLabel = (title, color) => {
		const labelId = crypto?.randomUUID() ?? Date.now().toString()
		setBoardsState(prev => ({
			...prev,

			labels: {
				...prev.labels,
				[labelId]: {
					id: labelId,
					color,
					title,
				},
			},
		}))
	}

	const editLabel = (label, title, color) => {
		setBoardsState(prev => {
			const currentLabel = prev.labels[label.id]

			return {
				...prev,

				labels: {
					...prev.labels,
					[label.id]: {
						...currentLabel,
						color,
						title,
					},
				},
			}
		})
	}

	const removeLabel = label => {
		setBoardsState(prev => {
			const newLabels = prev.labels
			delete newLabels[label.id]

			return {
				...prev,
				labels: newLabels,
			}
		})
	}

	const deadlineChange = (taskId, dates) => {
		setBoardsState(prev => {
			const task = prev.tasks[taskId]

			return {
				...prev,
				tasks: {
					...prev.tasks,
					[taskId]: {
						...task,
						startDate: dates.startDate,
						dueDate: dates.dueDate,
					},
				},
			}
		})
	}

	return {
		boardsState,
		setBoardsState,
		addColumn,
		addTask,
		removeTask,
		newTitle,
		setNewTitle,
		isAddingColumn,
		setIsAddingColumn,
		openContextMenu,
		closeContextMenu,
		updateText,
		updateColumnTitle,
		openSubMenu,
		copyTask,
		closeSubMenu,
		moveTask,
		toggleLabel,
		createLabel,
		editLabel,
		removeLabel,
		deadlineChange,
		inputRef,
	}
}

export default useBoardState
