import { useState } from 'react'
import TaskCard from './TaskCard'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'

const Column = ({ id, title, tasks, onAddTask, onRemoveTask }) => {
    const [columnTitle, setColumnTitle] = useState(title)
    const [isAddingTask, setIsAddingTask] = useState(false)
    const [text, setText] = useState("")

    const {isOver, setNodeRef} = useDroppable({
        id: `droppable-${id}`
    })
    const style = {
        color: isOver ? 'red' : undefined,
    }

    const handleSubmit = () => {
        if (!text.trim()) return;

        onAddTask(text)
        setText("")
        setIsAddingTask(false)
    }

    return (
        <div ref={setNodeRef} style={style} className="column">
            <div className="column__title">
                <input 
                    className="column__input"
                    type="text" placeholder="Название колонки" 
                    value={columnTitle} 
                    onChange={(e) => setColumnTitle(e.target.value)}/>
            </div>

            <SortableContext items={tasks.map(t => t.id)}>
                {tasks.map((task) => (
                    <TaskCard key={task.id} task={task} onDelete={() => onRemoveTask(task.id)}></TaskCard>
                ))}
            </SortableContext>

            {isAddingTask ? (
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
                <button onClick={() => setIsAddingTask(true)}>+ Добавить карточку</button>
            )}
            
        </div>
    )
}

export default Column