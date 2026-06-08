import React, { useContext, useState, useEffect, memo } from 'react'
import { FiltersContext } from '../../model/FiltersContext'
import { useDebounce } from '@shared/hooks/useDebounce'
import classes from './SearchTask.module.css'

export const SearchTask = memo(() => {
	const { globalFilters, setGlobalFilters } = useContext(FiltersContext)
	const [localValue, setLocalValue] = useState(globalFilters.search)
	const debouncedSearch = useDebounce(localValue, 300)

	useEffect(() => {
		setGlobalFilters(prev => {
			if (prev.search === debouncedSearch) return prev
			return { ...prev, search: debouncedSearch }
		})
	}, [debouncedSearch, setGlobalFilters])

	useEffect(() => {
		if (globalFilters.search === '' && localValue !== '') {
			setLocalValue('')
		}
	}, [globalFilters.search])

	return (
		<div className={classes.searchTask}>
			<input
				type='text'
				className={classes.searchTaskInput}
				placeholder='Поиск задачи'
				value={localValue}
				onChange={e => setLocalValue(e.target.value)}
			/>
		</div>
	)
})
