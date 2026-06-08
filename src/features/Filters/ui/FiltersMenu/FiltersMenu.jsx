import React, {
	useContext,
	useMemo,
	useRef,
	useState,
	useCallback,
	memo,
} from 'react'
import classes from './FiltersMenu.module.css'
import { MenuContentLayout } from '@shared/ui/MenuContentLayout'
import { CustomCheckbox } from '@shared/ui/CustomCheckbox/CustomCheckbox'
import { BoardContext } from '@entities/BoardData/BoardContext'
import { DEFAULT_FILTERS } from '../../model/useFilters'
import { UIContext } from '@shared/model/UIContext'
import { FiltersContext } from '../../model/FiltersContext'
import { useOnClickOutside } from '@shared/hooks/useOnClickOutside'

export const FiltersMenu = memo(({ onClose, excludeRef }) => {
	const { boardsState } = useContext(BoardContext)
	const { globalFilters, setGlobalFilters } = useContext(FiltersContext)
	const { closeMenu } = useContext(UIContext)

	const filtersRef = useRef(null)
	const [localFilters, setLocalFilters] = useState(globalFilters)

	const usedLabels = useMemo(() => {
		const allTasks = Object.values(boardsState.tasks)
		const allLabels = Object.values(boardsState.labels)
		const usedLabelIds = new Set()

		allTasks.forEach(task => {
			if (task.labelIds && task.labelIds.length > 0) {
				task.labelIds.forEach(id => usedLabelIds.add(id))
			}
		})

		return allLabels.filter(label => usedLabelIds.has(label.id))
	}, [boardsState.tasks, boardsState.labels])

	const toggleMultiple = useCallback((category, value) => {
		setLocalFilters(prev => {
			const currentList = prev[category]
			const isChecked = currentList.includes(value)

			return {
				...prev,
				[category]: isChecked
					? currentList.filter(item => item !== value)
					: [...currentList, value],
			}
		})
	}, [])

	const toggleSingle = useCallback((category, value) => {
		setLocalFilters(prev => {
			const currentList = prev[category]
			const isChecked = currentList.includes(value)

			return {
				...prev,
				[category]: isChecked ? [] : [value],
			}
		})
	}, [])

	const handleSubmit = useCallback(
		e => {
			e.preventDefault()
			setGlobalFilters(localFilters)
			closeMenu()
		},
		[localFilters, setGlobalFilters, closeMenu],
	)

	const handleClear = useCallback(() => {
		setLocalFilters(DEFAULT_FILTERS)
	}, [])

	useOnClickOutside(filtersRef, closeMenu, [excludeRef])

	return (
		<div ref={filtersRef}>
			<MenuContentLayout title={'Фильтры'} onClose={onClose}>
				<form className={classes.filters} onSubmit={handleSubmit}>
					<div className={classes.filtersContainer}>
						<span className={classes.filtersSubtitle}>Статус задачи</span>
						<div className={classes.filtersElements}>
							<div className={classes.filtersElement}>
								<CustomCheckbox
									id={'statusCompleted'}
									checked={localFilters.status.includes('statusCompleted')}
									onChange={() => toggleSingle('status', 'statusCompleted')}
									size={18}
								/>
								<label
									htmlFor={'statusCompleted'}
									className={classes.filtersElementLabel}
								>
									Задача выполнена
								</label>
							</div>
							<div className={classes.filtersElement}>
								<CustomCheckbox
									id={'statusNotCompleted'}
									checked={localFilters.status.includes('statusNotCompleted')}
									onChange={() => toggleSingle('status', 'statusNotCompleted')}
									size={18}
								/>
								<label
									htmlFor={'statusNotCompleted'}
									className={classes.filtersElementLabel}
								>
									Задача не выполнена
								</label>
							</div>
						</div>
					</div>

					<div className={classes.filtersContainer}>
						<span className={classes.filtersSubtitle}>Тип срока</span>
						<div className={classes.filtersElements}>
							<div className={classes.filtersElement}>
								<CustomCheckbox
									id={'start'}
									checked={localFilters.dateType.includes('start')}
									onChange={() => toggleSingle('dateType', 'start')}
									size={18}
								/>
								<label
									htmlFor={'start'}
									className={classes.filtersElementLabel}
								>
									Только начало
								</label>
							</div>
							<div className={classes.filtersElement}>
								<CustomCheckbox
									id={'end'}
									checked={localFilters.dateType.includes('end')}
									onChange={() => toggleSingle('dateType', 'end')}
									size={18}
								/>
								<label htmlFor={'end'} className={classes.filtersElementLabel}>
									Только конец
								</label>
							</div>
							<div className={classes.filtersElement}>
								<CustomCheckbox
									id={'range'}
									checked={localFilters.dateType.includes('range')}
									onChange={() => toggleSingle('dateType', 'range')}
									size={18}
								/>
								<label
									htmlFor={'range'}
									className={classes.filtersElementLabel}
								>
									Промежуток
								</label>
							</div>
						</div>
					</div>

					<div className={classes.filtersContainer}>
						<span className={classes.filtersSubtitle}>Статус срока</span>
						<div className={classes.filtersElements}>
							<div className={classes.filtersElement}>
								<CustomCheckbox
									id={'noDate'}
									checked={localFilters.dateStatus.includes('noDate')}
									onChange={() => toggleMultiple('dateStatus', 'noDate')}
									size={18}
								/>
								<label
									htmlFor={'noDate'}
									className={classes.filtersElementLabel}
								>
									Без даты
								</label>
							</div>
							<div className={classes.filtersElement}>
								<CustomCheckbox
									id={'overdue'}
									checked={localFilters.dateStatus.includes('overdue')}
									onChange={() => toggleMultiple('dateStatus', 'overdue')}
									size={18}
								/>
								<label
									htmlFor={'overdue'}
									className={classes.filtersElementLabel}
								>
									Просроченные
								</label>
							</div>
							<div className={classes.filtersElement}>
								<CustomCheckbox
									id={'endsLessThanTwoDays'}
									checked={localFilters.dateStatus.includes(
										'endsLessThanTwoDays',
									)}
									onChange={() =>
										toggleMultiple('dateStatus', 'endsLessThanTwoDays')
									}
									size={18}
								/>
								<label
									htmlFor={'endsLessThanTwoDays'}
									className={classes.filtersElementLabel}
								>
									До конца менее 2-х дней
								</label>
							</div>
							<div className={classes.filtersElement}>
								<CustomCheckbox
									id={'startsLessThanTwoDays'}
									checked={localFilters.dateStatus.includes(
										'startsLessThanTwoDays',
									)}
									onChange={() =>
										toggleMultiple('dateStatus', 'startsLessThanTwoDays')
									}
									size={18}
								/>
								<label
									htmlFor={'startsLessThanTwoDays'}
									className={classes.filtersElementLabel}
								>
									До начала менее 2-х дней
								</label>
							</div>
							<div className={classes.filtersElement}>
								<CustomCheckbox
									id={'moreThanTwoDays'}
									checked={localFilters.dateStatus.includes('moreThanTwoDays')}
									onChange={() =>
										toggleMultiple('dateStatus', 'moreThanTwoDays')
									}
									size={18}
								/>
								<label
									htmlFor={'moreThanTwoDays'}
									className={classes.filtersElementLabel}
								>
									До начала более 2-х дней
								</label>
							</div>
						</div>
					</div>

					<div className={classes.filtersContainer}>
						<span className={classes.filtersSubtitle}>Метки</span>
						<div className={classes.filtersElements}>
							<div className={classes.filtersElement}>
								<CustomCheckbox
									id={'noLabels'}
									checked={localFilters.labels.includes('noLabels')}
									onChange={() => toggleMultiple('labels', 'noLabels')}
									size={18}
								/>
								<label
									htmlFor={'noLabels'}
									className={classes.filtersStatusLabel}
								>
									Без меток
								</label>
							</div>

							{usedLabels.map(label => (
								<div className={classes.filtersElement} key={label.id}>
									<CustomCheckbox
										id={`hasLabel-${label.id}`}
										checked={localFilters.labels.includes(label.id)}
										onChange={() => toggleMultiple('labels', label.id)}
										size={18}
									/>
									<label
										htmlFor={`hasLabel-${label.id}`}
										className={`${classes.filtersStatusLabel} ${classes.filtersLabelPill}`}
										style={{ color: label.color }}
									>
										<span>{label.title}</span>
									</label>
								</div>
							))}
						</div>
					</div>

					<div className={classes.filtersContainer}>
						<span className={classes.filtersSubtitle}>Другое</span>
						<div className={classes.filtersElements}>
							<div className={classes.filtersElement}>
								<CustomCheckbox
									id={'hasDescription'}
									checked={localFilters.other.includes('hasDescription')}
									onChange={() => toggleMultiple('other', 'hasDescription')}
									size={18}
								/>
								<label
									htmlFor={'hasDescription'}
									className={classes.filtersElementLabel}
								>
									С описанием
								</label>
							</div>
							<div className={classes.filtersElement}>
								<CustomCheckbox
									id={'hasChecklists'}
									checked={localFilters.other.includes('hasChecklists')}
									onChange={() => toggleMultiple('other', 'hasChecklists')}
									size={18}
								/>
								<label
									htmlFor={'hasChecklists'}
									className={classes.filtersElementLabel}
								>
									С чеклистами
								</label>
							</div>
						</div>
					</div>

					<div className={classes.filtersButtons}>
						<button type='submit' className={classes.filtersConfirmButton}>
							Применить
						</button>
						<button
							type='button'
							className={classes.filtersClearButton}
							onClick={handleClear}
						>
							Очистить
						</button>
					</div>
				</form>
			</MenuContentLayout>
		</div>
	)
})
