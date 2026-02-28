import { useState, useRef, useEffect } from "react";

const useBoardState = (initialData) => {
    const [board, setBoard] = useState(() => {
        const saved = localStorage.getItem("board")
        return saved ? JSON.parse(saved) : {...initialData}
    });

    const [newTitle, setNewTitle] = useState("");
    const [isAddingColumn, setIsAddingColumn] = useState(false);

    const inputRef = useRef(null)

    useEffect(() => {
        if (isAddingColumn && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isAddingColumn])

    useEffect(() => {
        localStorage.setItem('board', JSON.stringify(board))
    }, [board])

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

    return {
        board,
        setBoard,
        addColumn,
        addTask,
        removeTask,
        newTitle,
        setNewTitle,
        isAddingColumn,
        setIsAddingColumn,
        inputRef
    };
}

export default useBoardState