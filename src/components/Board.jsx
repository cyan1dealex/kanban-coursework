import { useState } from 'react'
import Column from './Column'

const Board = () => {
    const [columns, setColumns] = useState([
        {
            title: "Список дел",
            tasks: ["Задача 1", "Задача 2", "Задача 3"]
        },
        {
            title: "В процессе",
            tasks: ["Задача 5", "Задача 6"]
        },
        {
            title: "Готово",
            tasks: ["Задача 7", "Задача 8"]
        },
    ]);

    const addTask = (columnIndex, text) => {
        setColumns((prev) => 
            prev.map((col, i) => 
                i === columnIndex 
                ? {...col, tasks: [...col.tasks, text]}
                : col
            )
        )
    }
    
    return (
        <div className="board">
            {columns.map((col, index) => (
                <Column key={col.title} title={col.title} tasks={col.tasks} onAddTask={(text) => addTask(index, text)}/>
            ))}
        </div>
    )
}

export default Board