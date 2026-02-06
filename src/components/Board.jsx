import { useState } from 'react'
import Column from './Column'

const Board = () => {
    // const [columns, setColumns] = useState([
    //     {
    //         id: 1,
    //         title: "Список дел",
    //         tasks: [{id: 1, text: "Задача 1"}, {id: 2, text: "Задача 2"}, {id: 3, text: "Задача 3"}]
    //     },
    //     {
    //         id: 2,
    //         title: "В процессе",
    //         tasks: [{id: 4, text: "Задача 4"}, {id: 5, text: "Задача 5"}, ]
    //     },
    //     {
    //         id: 3,
    //         title: "Готово",
    //         tasks: [{id: 6, text: "Задача 6"}, {id: 7, text: "Задача 7"}, ]
    //     },
    // ]);

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

    return (
        <div className="board">
            {board.columnOrder.map((columnId) => {
                const column = board.columns[columnId]

                const tasks = column.taskIds.map((taskId) => board.tasks[taskId])

                return (
                    <Column 
                    key={column.title}
                    title={column.title} 
                    tasks={tasks} 
                    onAddTask={(text) => addTask(columnId, text)} 
                    onRemoveTask={(taskId) => removeTask(columnId, taskId)}/>
                )
            })}

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
    )
}

export default Board