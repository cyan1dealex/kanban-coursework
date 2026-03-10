import { useState, useRef, useEffect } from "react";

const useBoardState = (initialData) => {
    const [boards, setBoards] = useState(() => {
        const saved = localStorage.getItem("boards")
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
        localStorage.setItem('boards', JSON.stringify(boards))
    }, [boards])

    const addColumn = (boardId) => {
        if (!newTitle.trim()) return
        
        const newColumnId = `column-${Date.now()}`

        const newColumn = {
            id: newColumnId,
            title: newTitle,
            taskIds: [],
        }

        setBoards((prev) => {
            return {
                ...prev,

                boards: {
                    ...prev.boards,

                    [boardId]: {
                        ...prev.boards[boardId],

                        columns: {
                            ...prev.boards[boardId].columns,
                            [newColumnId]: newColumn,
                        },
                        columnOrder: [...prev.boards[boardId].columnOrder, newColumnId],
                    },

                }
            }
        })

        setIsAddingColumn(false)
        setNewTitle("")
    }

    const addTask = (boardId, columnIndex, text) => {
        const newTaskId = `task-${Date.now()}`
        
        const newTask = {
            id: newTaskId,
            text
        }

        setBoards((prev) => {
            const column = prev.boards[boardId].columns[columnIndex]
            
            return {
                ...prev,

                boards: {
                    ...prev.boards,

                    [boardId]: {
                        ...prev.boards[boardId],

                        tasks: {
                            ...prev.boards[boardId].tasks,
                            [newTaskId]: newTask
                        },

                        columns: {
                            ...prev.boards[boardId].columns,
                            [columnIndex]: {
                                ...column,
                                taskIds: [...column.taskIds, newTaskId],
                            },
                        },
                    }
                }
            }
        })
    }

    const removeTask = (boardId, columnIndex, taskId) => {
        setBoards((prev) => {
            const board = prev.boards[boardId];
            const column = board.columns[columnIndex]
            const newTasks = {...board.tasks}
            delete newTasks[taskId]

            return {
                ...prev,

                boards: {
                    ...prev.boards,
                    
                    [boardId]: {
                        ...board,
                        
                        tasks: newTasks,
        
                        columns: {
                            ...board.columns,
                            [columnIndex]: {
                                ...column,
                                taskIds: column.taskIds.filter(
                                    (id) => id !== taskId
                                ),
                            },
                        },
                    }
                },
            }
        })
    }

    return {
        boards,
        setBoards,
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