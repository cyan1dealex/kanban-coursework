import { useSortable } from "@dnd-kit/sortable";

const TaskCardOverlay = ({ task }) => {
    return (
        <div className={"taskCardOverlay"}>
            
            <p className="taskCard__text">
                {task.text}
            </p>
            
            <button 
            >x</button>
        </div>
    )
}

export default TaskCardOverlay