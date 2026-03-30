import React, { useState } from 'react'
import classes from './Calendar.module.css'

const Calendar = ({
	value,
	onChange,
	isStartDateActive = false,
	isEndDateActive = true,
}) => {
	const ensureDate = val => {
		const date = new Date(val)
		return isNaN(date.getTime()) ? new Date() : date
	}

	const [viewDate, setViewDate] = useState(() =>
		ensureDate(value?.start || value?.end),
	)

	const year = viewDate.getFullYear()
	const month = viewDate.getMonth()

	const handleDayClick = clickedDate => {
		if (!onChange) return

		let newRange = { ...value }

		if (isStartDateActive && isEndDateActive) {
			if (value.start && value.end) {
				newRange = { start: clickedDate, end: null }
			} else if (value.start && !value.end) {
				newRange =
					clickedDate < new Date(value.start)
						? { start: clickedDate, end: null }
						: { ...value, end: clickedDate }
			} else if (!value.start && value.end) {
				newRange =
					clickedDate <= new Date(value.end)
						? { ...value, start: clickedDate }
						: { start: clickedDate, end: null }
			} else {
				newRange = { start: clickedDate, end: null }
			}
		} else if (isStartDateActive && !isEndDateActive) {
			newRange.start = clickedDate
		} else {
			newRange.end = clickedDate
		}

		onChange(newRange)
	}

	const generateDays = () => {
		const firstDayOfMonth = new Date(year, month, 1)
		const daysInMonth = new Date(year, month + 1, 0).getDate()
		const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7
		const prevMonthLastDay = new Date(year, month, 0).getDate()

		const days = []

		for (let i = startDayOfWeek - 1; i >= 0; i--) {
			days.push({
				day: prevMonthLastDay - i,
				month: month - 1,
				year,
				isCurrentMonth: false,
			})
		}
		for (let i = 1; i <= daysInMonth; i++) {
			days.push({ day: i, month, year, isCurrentMonth: true })
		}

		const remainingDays = 42 - days.length
		for (let i = 1; i <= remainingDays; i++) {
			days.push({ day: i, month: month + 1, year, isCurrentMonth: false })
		}
		return days
	}

	// Оптимизация: сравниваем даты без времени для стилизации
	const checkIsSameDay = (d1, d2) => {
		if (!d1 || !d2) return false
		const date1 = new Date(d1)
		const date2 = new Date(d2)
		return (
			date1.getFullYear() === date2.getFullYear() &&
			date1.getMonth() === date2.getMonth() &&
			date1.getDate() === date2.getDate()
		)
	}

	return (
		<div className={classes.calendar}>
			<div className={classes.calendarHeader}>
				<button onClick={() => setViewDate(new Date(year, month - 1, 1))}>
					&lt;
				</button>
				<span>
					{new Intl.DateTimeFormat('ru-RU', {
						month: 'long',
						year: 'numeric',
					}).format(viewDate)}
				</span>
				<button onClick={() => setViewDate(new Date(year, month + 1, 1))}>
					&gt;
				</button>
			</div>

			<div className={classes.calendarGrid}>
				{['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(d => (
					<div key={d} className={classes.dayName}>
						{d}
					</div>
				))}

				{generateDays().map((d, i) => {
					const currentDate = new Date(d.year, d.month, d.day)
					const isStart = checkIsSameDay(value?.start, currentDate)
					const isEnd = checkIsSameDay(value?.end, currentDate)
					const isInRange =
						value?.start &&
						value?.end &&
						currentDate > new Date(value.start) &&
						currentDate < new Date(value.end)

					return (
						<div
							key={i}
							onClick={() => handleDayClick(currentDate)}
							className={`
								${classes.calendarGridItem} 
                                ${!d.isCurrentMonth ? classes.notCurrentMonth : ''} 
                                ${isStart ? classes.selectedStart : ''} 
                                ${isEnd ? classes.selectedEnd : ''} 
                                ${isInRange ? classes.inRange : ''}
							`.trim()}
						>
							{d.day}
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default Calendar
