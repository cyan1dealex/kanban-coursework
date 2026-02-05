import TaskCard from './TaskCard'

const Column = ({ title }) => {

    return (
        <div className="column">
            <h2>{title}</h2>

            <TaskCard text="Задача 1"></TaskCard>
            <TaskCard text="Задача 2"></TaskCard>
            <TaskCard text="Задача 3"></TaskCard>
        </div>
    )
}

export default Column