import { useEffect, useState, useCallback } from 'react'

export const useBoardState = initialData => {
	const [boardsState, setBoardsState] = useState(() => {
		const saved = localStorage.getItem('boards')
		return saved ? JSON.parse(saved) : { ...initialData }
	})

	useEffect(() => {
		localStorage.setItem('boards', JSON.stringify(boardsState))
	}, [boardsState])

	const createBoard = useCallback(boardTitle => {
		if (!boardTitle.trim()) return

		const id = crypto?.randomUUID() ?? Date.now().toString()
		const newBoardId = `board-${id}`

		const newBoard = {
			id: newBoardId,
			title: boardTitle,
			columnIds: [],
		}

		setBoardsState(prev => {
			return {
				...prev,
				boards: {
					...prev.boards,
					[newBoardId]: newBoard,
				},
				boardOrder: [...prev.boardOrder, newBoardId],
			}
		})

		return newBoardId
	}, [])

	const renameBoardTitle = useCallback((boardId, newBoardTitle) => {
		setBoardsState(prev => {
			const board = prev.boards[boardId]

			return {
				...prev,
				boards: {
					...prev.boards,
					[boardId]: {
						...board,
						title: newBoardTitle || `board-${boardId}`,
					},
				},
			}
		})
	}, [])

	const removeBoard = useCallback(boardId => {
		setBoardsState(prev => {
			const newBoardOrder = prev.boardOrder.filter(id => id !== boardId)

			const newBoards = { ...prev.boards }
			delete newBoards[boardId]

			return {
				...prev,
				boards: newBoards,
				boardOrder: newBoardOrder,
			}
		})
	}, [])

	const addColumn = useCallback((boardId, newTitle) => {
		if (!newTitle.trim()) return

		const id = crypto?.randomUUID() ?? Date.now().toString()
		const newColumnId = `column-${id}`

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
	}, [])

	const removeColumn = useCallback((boardId, columnId) => {
		setBoardsState(prev => {
			const board = prev.boards[boardId]

			const newColumnIds = board.columnIds.filter(id => id !== columnId)

			const newColumns = { ...prev.columns }
			delete newColumns[columnId]

			return {
				...prev,
				boards: {
					...prev.boards,
					[boardId]: {
						...board,
						columnIds: newColumnIds,
					},
				},
				columns: newColumns,
			}
		})
	}, [])

	const addTask = useCallback((columnIndex, text) => {
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
	}, [])

	const removeTask = useCallback((columnIndex, taskId) => {
		setBoardsState(prev => {
			const column = prev.columns[columnIndex]

			const newTaskIds = column.taskIds.filter(id => id !== taskId)

			const newTasks = { ...prev.tasks }
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
	}, [])

	const updateText = useCallback((taskId, newText) => {
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
	}, [])

	const updateColumnTitle = useCallback((columnId, newTitle) => {
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
	}, [])

	const copyTask = useCallback((task, text, columnId, position) => {
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
	}, [])

	const moveTask = useCallback(
		(task, prevColumnId, targetColumnId, position) => {
			setBoardsState(prev => {
				const prevColumn = prev.columns[prevColumnId]
				const targetColumn = prev.columns[targetColumnId]

				if (prevColumnId === targetColumnId) {
					const newTaskIds = prevColumn.taskIds.filter(id => id !== task.id)
					newTaskIds.splice(position - 1, 0, task.id)

					return {
						...prev,
						columns: {
							...prev.columns,
							[prevColumnId]: {
								...prevColumn,
								taskIds: newTaskIds,
							},
						},
					}
				}

				const newPrevTaskIds = prevColumn.taskIds.filter(id => id !== task.id)
				const newTaskIds = [...targetColumn.taskIds]
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
		},
		[],
	)

	const toggleLabel = useCallback((taskId, labelId) => {
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
	}, [])

	const createLabel = useCallback((title, color) => {
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
	}, [])

	const editLabel = useCallback((label, title, color) => {
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
	}, [])

	const removeLabel = useCallback(label => {
		setBoardsState(prev => {
			const newLabels = { ...prev.labels }
			delete newLabels[label.id]

			return {
				...prev,
				labels: newLabels,
			}
		})
	}, [])

	const deadlineChange = useCallback((taskId, dates) => {
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
	}, [])

	const toggleTaskDone = useCallback(taskId => {
		setBoardsState(prev => {
			const task = prev.tasks[taskId]

			return {
				...prev,
				tasks: {
					...prev.tasks,
					[taskId]: {
						...task,
						isDone: !task.isDone,
					},
				},
			}
		})
	}, [])

	const saveDescription = useCallback((taskId, html) => {
		setBoardsState(prev => {
			const task = prev.tasks[taskId]

			return {
				...prev,
				tasks: {
					...prev.tasks,
					[taskId]: {
						...task,
						description: html,
					},
				},
			}
		})
	}, [])

	const createCheckList = useCallback((taskId, title) => {
		setBoardsState(prev => {
			const task = prev.tasks[taskId]
			const checkLists = task.checkLists || {}

			const id = crypto?.randomUUID() ?? Date.now().toString()
			const newCheckList = {
				id,
				title,
				elements: [],
			}

			return {
				...prev,
				tasks: {
					...prev.tasks,
					[taskId]: {
						...task,
						checkLists: { ...checkLists, [id]: newCheckList },
					},
				},
			}
		})
	}, [])

	const createCheckListElement = useCallback((taskId, checkListId, text) => {
		setBoardsState(prev => {
			const task = prev.tasks[taskId]
			const checkList = task.checkLists[checkListId]
			const elements = checkList?.elements || []

			const newElement = {
				id: crypto?.randomUUID() ?? Date.now().toString(),
				text,
				isCompleted: false,
			}

			return {
				...prev,
				tasks: {
					...prev.tasks,
					[taskId]: {
						...task,
						checkLists: {
							...task.checkLists,
							[checkListId]: {
								...checkList,
								elements: [...elements, newElement],
							},
						},
					},
				},
			}
		})
	}, [])

	const removeChecklistElement = useCallback(
		(taskId, checkListId, elementId) => {
			setBoardsState(prev => {
				const task = prev.tasks[taskId]
				const checkList = task.checkLists[checkListId]

				const newElements = checkList.elements.filter(
					element => element.id !== elementId,
				)

				return {
					...prev,
					tasks: {
						...prev.tasks,
						[taskId]: {
							...task,
							checkLists: {
								...task.checkLists,
								[checkListId]: {
									...checkList,
									elements: newElements,
								},
							},
						},
					},
				}
			})
		},
		[],
	)

	const toggleChecklistCheckbox = useCallback(
		(taskId, checkListId, elementId) => {
			setBoardsState(prev => {
				const task = prev.tasks[taskId]
				const checkList = task.checkLists[checkListId]

				return {
					...prev,
					tasks: {
						...prev.tasks,
						[taskId]: {
							...task,
							checkLists: {
								...task.checkLists,
								[checkListId]: {
									...checkList,
									elements: checkList.elements.map(el =>
										el.id === elementId
											? { ...el, isCompleted: !el.isCompleted }
											: el,
									),
								},
							},
						},
					},
				}
			})
		},
		[],
	)

	const changeElementText = useCallback(
		(taskId, checkListId, elementId, newText) => {
			setBoardsState(prev => {
				const task = prev.tasks[taskId]
				const checkList = task.checkLists[checkListId]
				const newElements = checkList.elements.map(el =>
					el.id === elementId
						? {
								...el,
								text: newText,
							}
						: el,
				)

				return {
					...prev,
					tasks: {
						...prev.tasks,
						[taskId]: {
							...task,
							checkLists: {
								...task.checkLists,
								[checkListId]: {
									...checkList,
									elements: newElements,
								},
							},
						},
					},
				}
			})
		},
		[],
	)

	return {
		boardsState,
		setBoardsState,
		createBoard,
		renameBoardTitle,
		removeBoard,
		addColumn,
		removeColumn,
		addTask,
		removeTask,
		updateText,
		updateColumnTitle,
		copyTask,
		moveTask,
		toggleLabel,
		createLabel,
		editLabel,
		removeLabel,
		deadlineChange,
		toggleTaskDone,
		saveDescription,
		createCheckList,
		createCheckListElement,
		removeChecklistElement,
		toggleChecklistCheckbox,
		changeElementText,
	}
}
