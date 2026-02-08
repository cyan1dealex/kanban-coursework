import { useState } from 'react'
import Column from './Column'
import { closestCorners, DndContext, DragOverlay } from '@dnd-kit/core';
import { arrayMove, horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';

const Board = () => {
    const [board, setBoard] = useState({
        tasks: {
            "1": {id: "1", text: "Задача 1"},
            "2": {id: "2", text: "Задача 2"},
            "3": {id: "3", text: "Задача 3"},
        },

        columns: {
            "column-1": {
                id: "column-1",
                title: "Список дел",
                taskIds: ["1", "2"],
            },

            "column-2": {
                id: "column-2",
                title: "В процессе",
                taskIds: ["3"],
            },

            "column-3": {
                id: "column-3",
                title: "Готово",
                taskIds: [],
            }
        },

        columnOrder: ["column-1", "column-2", "column-3"]
    });

    const [isAddingColumn, setIsAddingColumn] = useState(false)
    const [newTitle, setNewTitle] = useState("")
    const [activeTask, setActiveTask] = useState(null)

    const addColumn = () => {
        if (!newTitle.trim()) return
        
        const newColumnId = `column-${Date.now()}`

        const newColumn = {
            id: newColumnId,
            title: newTitle,
            taskIds: [],
        }

        setBoard((prev) => {
            return {
                ...prev,

                columns: {
                    ...prev.columns,
                    [newColumnId]: newColumn,
                },

                columnOrder: [...prev.columnOrder, newColumnId],
            }
        })

        setIsAddingColumn(false)
        setNewTitle("")
    }

    const addTask = (columnIndex, text) => {
        const newTaskId = `task-${Date.now()}`
        
        const newTask = {
            id: newTaskId,
            text
        }

        setBoard((prev) => {
            const column = prev.columns[columnIndex]

            return {
                ...prev,

                tasks: {
                    ...prev.tasks,
                    [newTaskId]: newTask
                },

                columns: {
                    ...prev.columns,
                    [columnIndex]: {
                        ...column,
                        taskIds: [...column.taskIds, newTaskId],
                    },
                },
            }
        })
    }

    const removeTask = (columnIndex, taskId) => {
        setBoard((prev) => {
            const column = prev.columns[columnIndex]
            const newTasks = {...prev.tasks}
            delete newTasks[taskId]

            return {
                ...prev,

                tasks: newTasks,

                columns: {
                    ...prev.columns,
                    [columnIndex]: {
                        ...column,
                        taskIds: column.taskIds.filter(
                            (id) => id !== taskId
                        ),
                    },
                },
            }
        })
    }

    const handleDragStart = ({active}) => {
        if (active.data.current.type === "task") {
            setActiveTask(active.id)
        }
    }

    const handleDragEnd = (event) => {
        const { active, over } = event

        const activeType = active.data.current.type
        const overType = over.data.current.type

        const activeId = active.id
        const overId = over.id

        const fromColumnId = active.data.current.columnId
        const toColumnId = over.data.current.columnId

        if (!over || active === over) return

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

                // const oldIndex = oldColumn.taskIds.indexOf(active.id)
                // const newIndex = oldColumn.taskIds.indexOf(over.id)
                
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

        setActiveTask(null)
    }

    return (
        <>
            <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <div className="board">
                    <SortableContext items={board.columnOrder} strategy={horizontalListSortingStrategy}>
                        {board.columnOrder.map((columnId) => {
                            const column = board.columns[columnId]
                            const tasks = column.taskIds.map((taskId) => board.tasks[taskId])

                            return (
                                <Column 
                                id={column.id}
                                key={column.title}
                                title={column.title} 
                                tasks={tasks} 
                                onAddTask={(text) => addTask(columnId, text)} 
                                onRemoveTask={(taskId) => removeTask(columnId, taskId)}/>
                            )
                        })}
                    </SortableContext>
                    

                    {isAddingColumn ? (
                        <div className="board__addColumn">
                            <input 
                                type="text" 
                                placeholder="Название колонки"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                            />
                            <button onClick={addColumn}>Добавить </button>
                        </div>
                    ) : (
                        <button className="board__addColumnButton" onClick={() => setIsAddingColumn(true)}>+ Добавить колонку</button>
                    )}
                </div>
                <DragOverlay>
                    {activeTask ? (
                    <TaskCard task={board.tasks[activeTask]} overlay />
                    ) : null}
                </DragOverlay>
            </DndContext>
        </>
    )
}

export default Board