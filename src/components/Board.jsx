import { useState } from 'react'
import Column from './Column'

const Board = () => {
    const [columns, setColumns] = useState([
        {
            id: 1,
            title: "Список дел",
            tasks: [{id: 1, text: "Задача 1"}, {id: 2, text: "Задача 2"}, {id: 3, text: "Задача 3"}]
        },
        {
            id: 2,
            title: "В процессе",
            tasks: [{id: 4, text: "Задача 4"}, {id: 5, text: "Задача 5"}, ]
        },
        {
            id: 3,
            title: "Готово",
            tasks: [{id: 6, text: "Задача 6"}, {id: 7, text: "Задача 7"}, ]
        },
    ]);

    const [isAddingColumn, setIsAddingColumn] = useState(false)
    const [newTitle, setNewTitle] = useState("")

    const addColumn = () => {
        const newColumn = {
            id: Date.now(),
            title: newTitle,
            tasks: []
        }

        setColumns(prev => [...prev, newColumn])
        setIsAddingColumn(false)
        setNewTitle("")
    }

    const addTask = (columnIndex, text) => {
        const newTask = {
            id: Date.now(),
            text
        }

        setColumns((prev) => 
            prev.map((col, i) => 
                i === columnIndex 
                ? {...col, tasks: [...col.tasks, newTask]}
                : col
            )
        )
    }

    const removeTask = (columnId, taskId) => {
        setColumns((prev) => 
            prev.map((col, i) => 
                i === columnId 
                ? {...col, tasks: col.tasks.filter(task => task.id !== taskId)}
                : col
            )
        )
    }

    return (
        <div className="board">
            {columns.map((col, index) => (
                <Column key={col.title} title={col.title} tasks={col.tasks} onAddTask={(text) => addTask(index, text)} onRemoveTask={(taskId) => removeTask(index, taskId)}/>
            ))}

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