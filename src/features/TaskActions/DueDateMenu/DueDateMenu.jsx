import React, {
	useContext,
	useState,
	useEffect,
	useCallback,
	memo,
} from 'react'
import { Calendar } from '@shared/ui/Calendar'
import { BoardContext } from '@entities/BoardData/BoardContext'
import { MenuContentLayout } from '@shared/ui/MenuContentLayout'
import { CustomCheckbox } from '@shared/ui/CustomCheckbox/CustomCheckbox'
import { UIContext } from '@shared/model/UIContext'
import classes from './DueDateMenu.module.css'

export const DueDateMenu = memo(({ taskId }) => {
	const { boardsState, deadlineChange } = useContext(BoardContext)
	const { closeSubMenu } = useContext(UIContext)

	const task = boardsState.tasks[taskId]
	const isNoDatesSet = !task.startDate && !task.dueDate

	const [checkBoxStartDate, setCheckBoxStartDate] = useState(!!task.startDate)
	const [checkBoxEndDate, setCheckBoxEndDate] = useState(
		isNoDatesSet ? true : !!task.dueDate,
	)

	const [range, setRange] = useState({
		start: task.startDate ? new Date(task.startDate) : null,
		end: task.dueDate
			? new Date(task.dueDate)
			: isNoDatesSet
				? new Date(new Date().setDate(new Date().getDate() + 1))
				: null,
	})

	useEffect(() => {
		const noDates = !task.startDate && !task.dueDate

		setCheckBoxStartDate(!!task.startDate)
		setCheckBoxEndDate(noDates ? true : !!task.dueDate)

		setRange({
			start: task.startDate ? new Date(task.startDate) : null,
			end: task.dueDate
				? new Date(task.dueDate)
				: noDates
					? new Date(new Date().setDate(new Date().getDate() + 1))
					: null,
		})
	}, [task.startDate, task.dueDate])

	// ОПТИМИЗАЦИЯ: изолируем утилиту форматирования даты в useCallback
	const formatDateForInput = useCallback(date => {
		if (!date) return ''
		const d = new Date(date)
		const year = d.getFullYear()
		const month = String(d.getMonth() + 1).padStart(2, '0')
		const day = String(d.getDate()).padStart(2, '0')
		return `${year}-${month}-${day}`
	}, [])

	const handleInputChange = useCallback((field, value) => {
		if (!value) {
			setRange(prev => ({ ...prev, [field]: null }))
			if (field === 'start') setCheckBoxStartDate(false)
			if (field === 'end') setCheckBoxEndDate(false)
			return
		}

		const newDate = new Date(value)
		if (isNaN(newDate.getTime())) return

		setRange(prev => {
			const nextRange = { ...prev, [field]: newDate }
			if (nextRange.start && nextRange.end && nextRange.start > nextRange.end) {
				return prev
			}
			return nextRange
		})
	}, [])

	const handleCalendarChange = useCallback(
		newRange => {
			setRange(newRange)
			if (!checkBoxStartDate && !checkBoxEndDate) {
				setCheckBoxEndDate(true)
			}
		},
		[checkBoxStartDate, checkBoxEndDate],
	)

	const handleSaveDate = useCallback(() => {
		deadlineChange(task.id, {
			startDate:
				checkBoxStartDate && range.start ? range.start.toISOString() : null,
			dueDate: checkBoxEndDate && range.end ? range.end.toISOString() : null,
		})
		closeSubMenu()
	}, [
		deadlineChange,
		task.id,
		checkBoxStartDate,
		checkBoxEndDate,
		range,
		closeSubMenu,
	])

	const handleDeleteDate = useCallback(() => {
		deadlineChange(task.id, { startDate: null, dueDate: null })
		closeSubMenu()
	}, [deadlineChange, task.id, closeSubMenu])

	return (
		<MenuContentLayout title={'Даты'} onClose={closeSubMenu}>
			<div className={classes.dueDateMenu}>
				<Calendar
					value={range}
					onChange={handleCalendarChange}
					isStartDateActive={checkBoxStartDate}
					isEndDateActive={checkBoxEndDate}
				/>

				<div className={classes.dueDateMenuStartEnd}>
					<fieldset className={classes.dueDateMenuFieldset}>
						<legend className={classes.dueDateMenuFieldsetTitle}>
							Дата начала
						</legend>
						<div className={classes.dueDateMenuInputs}>
							<CustomCheckbox
								id={`startDateCheckbox-${task.id}`}
								checked={checkBoxStartDate}
								onChange={e => {
									const isChecked = e.target.checked
									setCheckBoxStartDate(isChecked)

									if (!isChecked) {
										setRange(prev => ({ ...prev, start: null }))
									} else if (!range.start) {
										setRange(prev => {
											let newStart = new Date()
											if (prev.end && newStart > prev.end) {
												newStart = new Date(prev.end)
											}
											return { ...prev, start: newStart }
										})
									}
								}}
							/>
							<input
								type='date'
								disabled={!checkBoxStartDate}
								className={classes.dueDateMenuInput}
								value={formatDateForInput(range.start)}
								onChange={e => handleInputChange('start', e.target.value)}
								max={
									checkBoxEndDate && range.end
										? formatDateForInput(range.end)
										: ''
								}
							/>
						</div>
					</fieldset>

					<fieldset className={classes.dueDateMenuFieldset}>
						<legend className={classes.dueDateMenuFieldsetTitle}>Срок</legend>
						<div className={classes.dueDateMenuInputs}>
							<CustomCheckbox
								id={`dueDateCheckbox-${task.id}`}
								checked={checkBoxEndDate}
								onChange={e => {
									const isChecked = e.target.checked
									setCheckBoxEndDate(isChecked)

									if (!isChecked) {
										setRange(prev => ({ ...prev, end: null }))
									} else if (!range.end) {
										setRange(prev => {
											let newEnd = new Date()
											newEnd.setDate(newEnd.getDate() + 1)
											if (prev.start && newEnd < prev.start) {
												newEnd = new Date(prev.start)
											}
											return { ...prev, end: newEnd }
										})
									}
								}}
							/>
							<input
								type='date'
								disabled={!checkBoxEndDate}
								className={classes.dueDateMenuInput}
								value={formatDateForInput(range.end)}
								onChange={e => handleInputChange('end', e.target.value)}
								min={
									checkBoxStartDate && range.start
										? formatDateForInput(range.start)
										: ''
								}
							/>
						</div>
					</fieldset>
				</div>

				<div className={classes.dueDateMenuButtons}>
					<button className={classes.saveButton} onClick={handleSaveDate}>
						Сохранить
					</button>
					<button className={classes.removeButton} onClick={handleDeleteDate}>
						Удалить
					</button>
				</div>
			</div>
		</MenuContentLayout>
	)
})
