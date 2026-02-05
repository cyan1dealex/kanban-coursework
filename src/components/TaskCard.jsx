const TaskCard = ({ text, onDelete }) => {
    return (
        <div className="taskCard">
            {text}
            <button onClick={onDelete}>x</button>
        </div>
    )
}

export default TaskCard