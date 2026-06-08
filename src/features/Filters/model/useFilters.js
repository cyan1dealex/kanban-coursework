import { useDeferredValue, useEffect, useMemo, useState } from 'react'

export const DEFAULT_FILTERS = {
	search: '',
	status: [],
	dateType: [],
	dateStatus: [],
	labels: [],
	other: [],
}

export const useFilters = (tasks = {}, boardId) => {
	const [globalFilters, setGlobalFilters] = useState(() => {
		try {
			const saved = localStorage.getItem(`filters_${boardId}`)
			if (saved) {
				return { ...DEFAULT_FILTERS, ...JSON.parse(saved) }
			}
		} catch (error) {
			console.error('Ошибка при чтении фильтров', error)
		}
		return DEFAULT_FILTERS
	})

	useEffect(() => {
		if (!boardId) return

		const isDefault =
			JSON.stringify(globalFilters) === JSON.stringify(DEFAULT_FILTERS)

		if (isDefault) {
			localStorage.removeItem(`filters_${boardId}`)
		} else {
			localStorage.setItem(`filters_${boardId}`, JSON.stringify(globalFilters))
		}
	}, [globalFilters, boardId])

	const defferedSearch = useDeferredValue(globalFilters.search)

	const filteredTasks = useMemo(() => {
		const result = {}
		const allTasksArray = Object.values(tasks)

		if (allTasksArray.length === 0) return result

		allTasksArray.forEach(task => {
			// поиск
			const matchesSearch =
				!defferedSearch ||
				task?.text?.toLowerCase().includes(defferedSearch.toLowerCase())

			// статус задачи
			let matchesStatus = true
			if (globalFilters.status.length > 0) {
				const status = globalFilters.status[0]
				if (status === 'statusCompleted') matchesStatus = task.isDone === true
				if (status === 'statusNotCompleted')
					matchesStatus = task.isDone !== true
			}

			// тип срока
			let matchesDateType = true
			if (globalFilters.dateType.length > 0) {
				const type = globalFilters.dateType[0]
				const hasStart = !!task.startDate
				const hasEnd = !!task.dueDate

				if (type === 'start') matchesDateType = hasStart && !hasEnd
				if (type === 'end') matchesDateType = !hasStart && hasEnd
				if (type === 'range') matchesDateType = hasStart && hasEnd
			}

			// статус срока
			let matchesDateStatus = true
			if (globalFilters.dateStatus.length > 0) {
				matchesDateStatus = globalFilters.dateStatus.some(filter => {
					if (filter === 'noDate') return !task.startDate && !task.dueDate

					const today = new Date()
					today.setHours(0, 0, 0, 0)

					if (filter === 'overdue') {
						if (!task.dueDate || task.isDone) return false
						const due = new Date(task.dueDate)
						due.setHours(0, 0, 0, 0)
						return due < today
					}

					if (filter === 'endsLessThanTwoDays') {
						if (!task.dueDate || task.isDone) return false
						const due = new Date(task.dueDate)
						due.setHours(0, 0, 0, 0)
						const diffDays = Math.round((due - today) / (1000 * 60 * 60 * 24))
						return diffDays >= 0 && diffDays < 2
					}

					if (filter === 'startsLessThanTwoDays') {
						if (!task.startDate) return false
						const start = new Date(task.startDate)
						start.setHours(0, 0, 0, 0)
						const diffDays = Math.round((start - today) / (1000 * 60 * 60 * 24))
						return diffDays >= 0 && diffDays < 2
					}

					if (filter === 'moreThanTwoDays') {
						const targetDate = task.startDate || task.dueDate
						if (!targetDate) return false
						const target = new Date(targetDate)
						target.setHours(0, 0, 0, 0)
						const diffDays = Math.round(
							(target - today) / (1000 * 60 * 60 * 24),
						)
						return diffDays >= 2
					}

					return false
				})
			}

			// метки
			let matchesLabels = true
			if (globalFilters.labels.length > 0) {
				matchesLabels = globalFilters.labels.some(filter => {
					if (filter === 'noLabels')
						return !task.labelIds || task.labelIds.length === 0
					return task.labelIds?.includes(filter)
				})
			}

			// другое
			let matchesOther = true
			if (globalFilters.other.length > 0) {
				matchesOther = globalFilters.other.every(filter => {
					if (filter === 'hasDescription') {
						return !!task.description && task.description.trim().length > 0
					}
					if (filter === 'hasChecklists') {
						return task.checklists && Object.keys(task.checklists).length > 0
					}
					return true
				})
			}

			if (
				matchesSearch &&
				matchesStatus &&
				matchesDateType &&
				matchesDateStatus &&
				matchesLabels &&
				matchesOther
			) {
				result[task.id] = task
			}
		})

		return result
	}, [tasks, globalFilters, defferedSearch])

	return {
		globalFilters,
		setGlobalFilters,
		filteredTasks,
	}
}
