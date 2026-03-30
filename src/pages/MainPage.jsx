import { Link } from 'react-router-dom'
import INITIAL_DATA from '../data/mockData'
import { useContext } from 'react'
import { BoardContext } from '../context/BoardContext'

const MainPage = () => {
    const { boardsState } = useContext(BoardContext)

    return (
        <div className='main-page'>
            <h1 className='main-page__title'>Список досок</h1>

            <div className='boards-list'>
                {boardsState.boardOrder.map((boardId) => {
                    const currentBoard = boardsState.boards[boardId]

                    return (
                        <Link
                            key={boardId}
                            to={`/board/${boardId}`}
                            className='board-card'
                        >
                            {currentBoard.title || `Доска ${boardId}`}
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

export default MainPage