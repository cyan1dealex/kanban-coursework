import { useSortable } from "@dnd-kit/sortable";

const TaskCard = ({ task, onDelete, columnId }) => {
    const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({
        id: task.id,
        data: {
            type: "task",
            columnId: columnId,
        },
    })
    const style = {
        transform: transform
        ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
        : undefined,
        opacity: isDragging ? 0.3 : 1,
        backgroundColor: isDragging ? '#6f2338' : '#1f23383a',
        color: isDragging ? 'transparent' : 'black'
    };

    return (
        <div className="taskCard" ref={setNodeRef} style={style} {...listeners} {...attributes} >
            
            <p className="taskCard__text">
                {task.text}
            </p>
            
            <button 
                onPointerDown={(e) => {e.stopPropagation();}} 
                onClick={(e) => {onDelete()}}
                style={{opacity: isDragging ? 0 : 1}}
            >x</button>
        </div>
    )
}

export default TaskCard