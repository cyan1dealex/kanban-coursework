import { useSortable } from "@dnd-kit/sortable";

const TaskCard = ({ task, onDelete }) => {
    const {attributes, listeners, setNodeRef, transform} = useSortable({
        id: task.id,
    })
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <div className="taskCard" ref={setNodeRef} style={style} {...attributes}>
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