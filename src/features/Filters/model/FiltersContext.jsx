import { createContext } from 'react'
import { useFilters } from './useFilters'

export const FiltersContext = createContext({})

export const FiltersProvider = ({ children, boardId, tasks }) => {
	const filters = useFilters(tasks, boardId)

	return (
		<FiltersContext.Provider value={filters}>
			{children}
		</FiltersContext.Provider>
	)
}
