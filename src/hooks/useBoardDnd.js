import { useState } from "react";
import { arrayMove } from '@dnd-kit/sortable';

const useBoardDnd = (board, setBoard) => {
    const [activeTask, setActiveTask] = useState(null)
    const [activeColumn, setActiveColumn] = useState(null)

    const handleDragStart = ({active}) => {
        if (active.data.current.type === "task") {
            setActiveTask(active.id)
        }
        if (active.data.current.type === "column") {
            setActiveColumn(board.columns[active.id])
        }
    }

    const handleDragOver = (event ) => {
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
            setBoard((prev) => {
                const column = prev.columns[fromColumnId]

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
                    }
                }
            })
        }

        // Перемещение между колонками
        if (activeType === "task" && fromColumnId !== toColumnId) {
            setBoard((prev) => {
                const oldColumn = prev.columns[fromColumnId]
                const newColumn = prev.columns[toColumnId]

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
                    }
                }
            })
        }

        // Перемещение колонок
        if (activeType === "column" && overType === "column") {
            setBoard((prev) => {
                const oldIndex = prev.columnOrder.indexOf(active.id);
                const newIndex = overType === "column" 
                ? prev.columnOrder.indexOf(over.id) 
                : prev.columnOrder.indexOf(over.data.current.columnId);
                
                return {
                    ...prev,
                    columnOrder: arrayMove(prev.columnOrder, oldIndex, newIndex)
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