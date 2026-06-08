import { createContext } from 'react'
import { INITIAL_DATA } from '@entities/BoardData'
import { useBoardState } from '@entities/BoardData'

export const BoardContext = createContext({})

export const BoardProvider = ({ children }) => {
	const { boardsState, setBoardsState, ...crudActions } =
		useBoardState(INITIAL_DATA)

	return (
		<BoardContext.Provider
			value={{
				boardsState,
				setBoardsState,
				...crudActions,
			}}
		>
			{children}
		</BoardContext.Provider>
	)
}
