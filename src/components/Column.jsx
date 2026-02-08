import { useState } from 'react'
import TaskCard from './TaskCard'
import { useDroppable } from '@dnd-kit/core'
import { horizontalListSortingStrategy, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'

const Column = ({ id, title, tasks, onAddTask, onRemoveTask }) => {
    const [columnTitle, setColumnTitle] = useState(title)
    const [isAddingTask, setIsAddingTask] = useState(false)
    const [text, setText] = useState("")

    const {attributes, listeners, setNodeRef: setSortableRef, transform, transition, isDragging} = useSortable({
        id: id,
        data: {
            type: "column",
            columnId: id,
        },
    })

    const {isOver, setNodeRef: setDroppableRef} = useDroppable({
        id: id,
        data: {
            type: "column",
            columnId: id,
        },
    })
    const style = {
        transform: transform
        ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
        : undefined,
        transition,
        opacity: isDragging ? 0.5 : 1
    }

    const setRefs = (node) => {
        setSortableRef(node)
        setDroppableRef(node)
    }

    const handleSubmit = () => {
        if (!text.trim()) return;

        onAddTask(text)
        setText("")
        setIsAddingTask(false)
    }

    return (
        <div ref={setRefs} style={style} className="column">
            <div {...listeners} className="dragHandle">☰</div>
            
            <div className="column__title">
                <input 
                    className="column__input"
                    type="text" placeholder="Название колонки" 
                    value={columnTitle} 
                    onChange={(e) => setColumnTitle(e.target.value)}/>
            </div>

            <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                {tasks.map((task) => (
                    <TaskCard key={task.id} task={task} columnId={id} onDelete={() => onRemoveTask(task.id)}></TaskCard>
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