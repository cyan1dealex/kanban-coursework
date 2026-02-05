import Column from './Column'

const Board = () => {
    const columns = ["Сделать", "В процессе", "Завершено"]
    
    return (
        <div className="board">
            {columns.map((title) => (
                <Column key={title} title={title }/>
            ))}
        </div>
    )
}

export default Board