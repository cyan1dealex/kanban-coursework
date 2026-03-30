import React, { useContext, useState, useEffect } from 'react'
import classes from './DueDateMenu.module.css'
import Calendar from '../../../ui/Calendar/Calendar'
import { BoardContext } from '../../../../context/BoardContext'

const DueDateMenu = ({ task }) => {
	const { closeSubMenu, deadlineChange } = useContext(BoardContext)

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

	// ИСПРАВЛЕНИЕ: Берем локальную дату, чтобы избежать сдвига часовых поясов при toISOString
	const formatDateForInput = date => {
		if (!date) return ''
		const d = new Date(date)
		const year = d.getFullYear()
		const month = String(d.getMonth() + 1).padStart(2, '0')
		const day = String(d.getDate()).padStart(2, '0')
		return `${year}-${month}-${day}`
	}

	const handleInputChange = (field, value) => {
		// ИСПРАВЛЕНИЕ: Если пользователь стер дату в инпуте, отключаем чекбокс и зануляем поле
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
			// Защита от пересечения дат
			if (nextRange.start && nextRange.end && nextRange.start > nextRange.end) {
				return prev
			}
			return nextRange
		})
	}

	const handleCalendarChange = newRange => {
		setRange(newRange)
		if (!checkBoxStartDate && !checkBoxEndDate) {
			setCheckBoxEndDate(true)
		}
	}

	const handleSaveDate = () => {
		deadlineChange(task.id, {
			startDate:
				checkBoxStartDate && range.start ? range.start.toISOString() : null,
			dueDate: checkBoxEndDate && range.end ? range.end.toISOString() : null,
		})
		closeSubMenu()
	}

	const handleDeleteDate = () => {
		deadlineChange(task.id, { startDate: null, dueDate: null })
		closeSubMenu() // Закрываем меню после удаления для лучшего UX
	}

	return (
		<div className={classes.dueDateMenu}>
			<h2 className={classes.dueDateMenuTitle}>Даты</h2>

			<Calendar
				value={range}
				onChange={handleCalendarChange}
				isStartDateActive={checkBoxStartDate}
				isEndDateActive={checkBoxEndDate}
			/>

			{/* Блок Начало */}
			<fieldset className={classes.dueDateMenuFieldset}>
				<legend>Дата начала</legend>
				<input
					type='checkbox'
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
					value={formatDateForInput(range.start)}
					onChange={e => handleInputChange('start', e.target.value)}
					max={
						checkBoxEndDate && range.end ? formatDateForInput(range.end) : ''
					}
				/>
			</fieldset>

			{/* Блок Конец (Срок) */}
			<fieldset className={classes.dueDateMenuFieldset}>
				<legend>Срок</legend>
				<input
					type='checkbox'
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
					value={formatDateForInput(range.end)}
					onChange={e => handleInputChange('end', e.target.value)}
					min={
						checkBoxStartDate && range.start
							? formatDateForInput(range.start)
							: ''
					}
				/>
			</fieldset>

			<button onClick={handleSaveDate} className={classes.saveBtn}>
				Сохранить
			</button>
			<button onClick={handleDeleteDate}>Удалить</button>
			<button onClick={closeSubMenu} className={classes.closeDueDateMenuButton}>
				x
			</button>
		</div>
	)
}

export default DueDateMenu
