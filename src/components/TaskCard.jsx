import { useSortable } from "@dnd-kit/sortable";

const TaskCard = ({ task, onDelete, columnId, overlay }) => {
    const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({
        id: task.id,
        data: {
            type: "task",
            columnId: columnId,
        },
    })
    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    };

    return (
        <div className={`taskCard ${overlay ? 'overlay' : ''}`} ref={setNodeRef} style={style} {...attributes} >
            <div {...listeners} className="dragHandle">☰</div>
            
            {task.text}
            
            <button onClick={(e) => {
                    e.stopPropagation()
                    onDelete()
                }}
            >x</button>
        </div>
    )
}

export default TaskCard