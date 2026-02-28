import { useEffect, useRef, createContext } from 'react'
import INITIAL_DATA from '../data/mockData';
import useBoardState from '../hooks/useBoardState';
import useBoardDnd from '../hooks/useBoardDnd';

export const BoardContext = createContext({})

export const BoardProvider = (props) => {
    const { children } = props

    const { board, setBoard, ...crudActions } = useBoardState(INITIAL_DATA)
    const { ...dndActions } = useBoardDnd(board, setBoard)

    return (
        <BoardContext.Provider value={{
            board, 
            setBoard, 
            ...crudActions,
            ...dndActions,
        }}>
            { children }
        </BoardContext.Provider>
    )
}