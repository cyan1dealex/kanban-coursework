import { createContext } from 'react'
import INITIAL_DATA from '../data/mockData';
import useBoardState from '../hooks/useBoardState';
import useBoardDnd from '../hooks/useBoardDnd';
import { useParams } from 'react-router-dom';

export const BoardContext = createContext({})

export const BoardProvider = (props) => {
    const { children } = props

    const { boards, setBoards, ...crudActions } = useBoardState(INITIAL_DATA)

    return (
        <BoardContext.Provider value={{
            boards, 
            setBoards,
            ...crudActions,
        }}>
            { children }
        </BoardContext.Provider>
    )
}