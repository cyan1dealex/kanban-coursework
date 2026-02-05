import { useState } from 'react'
import Column from './Column'

const Board = () => {
    const [columns, setColumns] = useState([
        {
            title: "Список дел",
            tasks: [{id: 1, text: "Задача 1"}, {id: 2, text: "Задача 2"}, {id: 3, text: "Задача 3"}]
        },
        {
            title: "В процессе",
            tasks: [{id: 4, text: "Задача 1"}, {id: 5, text: "Задача 2"}, {id: 6, text: "Задача 3"}]
        },
        {
            title: "Готово",
            tasks: [{id: 7, text: "Задача 1"}, {id: 8, text: "Задача 2"}, {id: 9, text: "Задача 3"}]
        },
    ]);

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
        </div>
    )
}

export default Board