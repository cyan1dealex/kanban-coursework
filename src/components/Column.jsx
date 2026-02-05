import { useState } from 'react'
import TaskCard from './TaskCard'

const Column = ({ title, tasks, onAddTask, onRemoveTask }) => {
    const [columnTitle, setColumnTitle] = useState(title)
    const [isAdding, setIsAdding] = useState(false)
    const [text, setText] = useState("")

    const handleSubmit = () => {
        if (!text.trim()) return;

        onAddTask(text)
        setText("")
        setIsAdding(false)
    }

    return (
        <div className="column">
            <div className="column__title">
                <input 
                    className="column__input"
                    type="text" placeholder="Название колонки" 
                    value={columnTitle} 
                    onChange={(e) => setColumnTitle(e.target.value)}/>
            </div>

            {tasks.map((task) => (
                <TaskCard key={task.id} text={task.text} onDelete={() => onRemoveTask(task.id)}></TaskCard>
            ))}

            {isAdding ? (
                <div className="column__addTask">
                    <input 
                        type="text" 
                        placeholder="Текст задачи"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <button onClick={handleSubmit}>Добавить </button>
                </div>
            ) : (
                <button onClick={() => setIsAdding(true)}>+ Добавить карточку</button>
            )}
            
        </div>
    )
}

export default Column