import { useEffect, useRef, useState } from 'react'
import TaskCard from './TaskCard'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'

const Column = ({ id, title, tasks, onAddTask, onRemoveTask }) => {
    const [columnTitle, setColumnTitle] = useState(title)
    const [isAddingTask, setIsAddingTask] = useState(false)
    const [text, setText] = useState("")

    const inputRef = useRef(null)
    
    useEffect(() => {
        if (isAddingTask && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isAddingTask])

    const {listeners, setNodeRef, transform, transition, isDragging} = useSortable({
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
        opacity: isDragging ? 0.5 : 1,
    }

    const handleSubmit = () => {
        if (!text.trim()) return;

        onAddTask(text)
        setText("")
        setIsAddingTask(false)
    }

    return (
        <div ref={setNodeRef} style={style} className="column">
            <div {...listeners} style={{backgroundColor: isDragging ? '#6f2338' : '#1f23383a'}} 
            className="column__inner">
                <div className="column__title">
                    <input 
                        className="column__input"
                        style={{color: isDragging ? 'transparent' : 'black'}}
                        type="text" placeholder="Название колонки" 
                        value={columnTitle} 
                        onChange={(e) => setColumnTitle(e.target.value)}
                        onPointerDown={(e) => {e.stopPropagation();}}
                        />
                </div>

                <div className="column__tasks" style={{opacity: isDragging ? 0 : 1}}>
                    <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                        {tasks.map((task) => (
                                <TaskCard key={task.id} task={task} columnId={id} onDelete={() => onRemoveTask(task.id)}></TaskCard>
                            )
                        )}
                    </SortableContext>
                </div>

                {isAddingTask ? (
                    <div className="column__addTask">
                        <input 
                            type="text" 
                            placeholder="Текст задачи"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onPointerDown={(e) => {e.stopPropagation();}}
                            onKeyDown={(e) => {
                                if (e.key === ' ') e.stopPropagation();
                                if (e.key === 'Enter') {e.stopPropagation(); handleSubmit()} 
                                if (e.key === 'Escape') {setIsAddingTask(false); setText("")}
                            }}
                            ref={inputRef}
                        />
                        <button onPointerDown={(e) => {e.stopPropagation();}} onClick={handleSubmit}>Добавить </button>
                    </div>
                ) : (
                    <button style={{opacity: isDragging ? '0' : '1'}} onPointerDown={(e) => {e.stopPropagation();}} onClick={() => setIsAddingTask(true)}>+ Добавить карточку</button>
                )}
            </div>
        </div>
    )
}

export default Column