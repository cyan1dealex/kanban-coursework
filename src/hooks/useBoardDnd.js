import { useState } from "react";
import { arrayMove } from '@dnd-kit/sortable';

const useBoardDnd = (boardId, boardsState, setBoardsState) => {
    const [activeTask, setActiveTask] = useState(null)
    const [activeColumn, setActiveColumn] = useState(null)

    const currentBoard = boardsState.boards[boardId];

    const handleDragStart = ({ active }) => {
        if (active.data.current.type === "task") {
            setActiveTask(active.id)
        }
        if (active.data.current.type === "column") {
            setActiveColumn(boardsState.columns[active.id])
        }
    }

    const handleDragOver = (event) => {
        const { active, over } = event
        if (!over) return

        const activeType = active.data.current.type
        const overType = over.data.current.type

        const activeId = active.id
        const overId = over.id

        const fromColumnId = active.data.current.columnId
        const toColumnId = over.data.current.columnId

        // Перемещение внутри колонок
        if (activeType === overType && fromColumnId === toColumnId) {
            setBoardsState((prev) => {
                const column = boardsState.columns[fromColumnId]

                const oldIndex = column.taskIds.indexOf(active.id)
                const newIndex = column.taskIds.indexOf(over.id)

                return {
                    ...prev,

                    columns: {
                        ...prev.columns,

                        [fromColumnId]: {
                            ...column,
                            taskIds: arrayMove(column.taskIds, oldIndex, newIndex)
                        }
                    },
                }
            })
        }

        // Перемещение между колонками
        if (activeType === "task" && fromColumnId !== toColumnId) {
            setBoardsState((prev) => {
                const oldColumn = boardsState.columns[fromColumnId]
                const newColumn = boardsState.columns[toColumnId]

                if (!oldColumn || !newColumn) return prev;
                if (newColumn.taskIds.includes(activeId)) return prev;
                
                const targetTaskIds = [...newColumn.taskIds]
                const index = targetTaskIds.indexOf(overId)

                targetTaskIds.splice(index, 0, activeId)
                
                return {
                    ...prev,

                    columns: {
                        ...prev.columns,

                        [fromColumnId]: {
                            ...oldColumn,
                            taskIds: oldColumn.taskIds.filter(
                                (id) => id !== activeId
                            )
                        },
                        [toColumnId]: {
                            ...newColumn,
                            taskIds: overType === "task" 
                            ? targetTaskIds
                            : [...newColumn.taskIds, activeId]
                        }
                    },
                }
            })
        }

        // Перемещение колонок
        if (activeType === "column" && overType === "column") {
            setBoardsState((prev) => {
                const oldIndex = currentBoard.columnIds.indexOf(active.id);
                const newIndex = overType === "column" 
                ? currentBoard.columnIds.indexOf(over.id) 
                : currentBoard.columnIds.indexOf(over.data.current.columnId);
                
                return {
                    ...prev,

                    boards: {
                        ...prev.boards,

                        [boardId]: {
                            ...currentBoard,
                            
                            columnIds: arrayMove(currentBoard.columnIds, oldIndex, newIndex)
                        }
                    }
                };
            });
        }
    };

    const handleDragEnd = (event) => {
        setActiveTask(null)
        setActiveColumn(null)
    }

    return {
        activeTask,
        setActiveTask,
        activeColumn,
        setActiveColumn,
        handleDragStart,
        handleDragOver,
        handleDragEnd
    };
}

export default useBoardDnd;