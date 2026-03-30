import React, { useContext, useEffect, useRef, useState } from 'react'
import classes from './TaskMenu.module.css'
import { BoardContext } from '../../../../context/BoardContext'

const TaskMenu = ({ position, task }) => {
	const { boardsState, updateText, openSubMenu, closeContextMenu } =
		useContext(BoardContext)
	const [text, setText] = useState(task.text)
	const textAreaRef = useRef(null)

	const labels = task.labelIds
		? task.labelIds.map(id => boardsState.labels[id]).filter(Boolean)
		: []

	const deadlineType =
		task.startDate && task.dueDate
			? 'range'
			: task.startDate
				? 'start'
				: task.dueDate
					? 'end'
					: null

	const formatToDayMonth = dateString => {
		if (!dateString) return ''
		const date = new Date(dateString)

		return date.toLocaleDateString('ru-RU', {
			day: 'numeric',
			month: 'long',
		})
	}

	const openRef = useRef(null)
	const labelsRef = useRef(null)
	const dueDateRef = useRef(null)
	const copyRef = useRef(null)
	const moveRef = useRef(null)
	const deleteRef = useRef(null)

	useEffect(() => {
		if (textAreaRef.current) {
			textAreaRef.current.select()
		}
	}, [])

	useEffect(() => {
		if (textAreaRef.current) {
			const el = textAreaRef.current
			el.style.height = 'auto'
			el.style.height = el.scrollHeight + 'px'
		}
	}, [task.startDate, task.dueDate, labels.length])

	const handleInput = e => {
		setText(e.target.value)

		const el = e.target
		el.style.height = 'auto'
		el.style.height = el.scrollHeight + 'px'
	}

	return (
		<div
			className={classes.taskMenuWrapper}
			onClick={e => e.stopPropagation()}
			style={{
				position: 'absolute',
				left: -position.width,
			}}
		>
			<div className={classes.taskMenuContent}>
				<div className={classes.taskMenuTextAreaWrapper}>
					<textarea
						ref={textAreaRef}
						className={classes.textAreaSaveInput}
						style={{
							width: position.width,
							minHeight: position.height,
							paddingBottom:
								task.startDate || task.dueDate ? '40px' : undefined,
							paddingTop: labels.length > 0 ? '40px' : undefined,
						}}
						value={text}
						onChange={handleInput}
					/>

					<div className={classes.taskMenuLabels}>
						{labels.map(label => {
							if (!label) return null
							return (
								<div
									key={label?.id}
									className={classes.taskMenuLabel}
									style={{ backgroundColor: label.color }}
								></div>
							)
						})}
					</div>
					<div className={classes.taskMenuDeadlines}>
						{deadlineType === 'start' && (
							<div className={classes.taskMenuDeadlinesStart}>
								⌛ <span>Дата начала: {formatToDayMonth(task.startDate)}</span>
							</div>
						)}

						{deadlineType === 'end' && (
							<div className={classes.taskMenuDeadlinesStart}>
								⌛ <span>{formatToDayMonth(task.dueDate)}</span>
							</div>
						)}

						{deadlineType === 'range' && (
							<div className={classes.taskMenuDeadlinesStart}>
								⌛{' '}
								<span>
									{formatToDayMonth(task.startDate)} -{' '}
									{formatToDayMonth(task.dueDate)}
								</span>
							</div>
						)}
					</div>
				</div>

				<button
					className={classes.saveButton}
					onClick={() => {
						updateText(task.id, text)
						closeContextMenu()
					}}
				>
					Сохранить
				</button>
			</div>

			<div className={classes.sideActions}>
				<button
					ref={openRef}
					className={classes.actionButton}
					onClick={() => openSubMenu('open', openRef)}
				>
					Открыть карточку
				</button>
				<button
					ref={labelsRef}
					className={classes.actionButton}
					onClick={() => openSubMenu('labels', labelsRef)}
				>
					Метки
				</button>
				<button
					ref={dueDateRef}
					className={classes.actionButton}
					onClick={() => openSubMenu('dueDate', dueDateRef)}
				>
					Дедлайны
				</button>
				<button
					ref={moveRef}
					className={classes.actionButton}
					onClick={() => openSubMenu('move', moveRef)}
				>
					Переместить
				</button>
				<button
					ref={copyRef}
					className={classes.actionButton}
					onClick={() => openSubMenu('copy', copyRef)}
				>
					Копировать
				</button>
				<button
					ref={deleteRef}
					className={classes.actionButton}
					onClick={() => openSubMenu('delete', deleteRef)}
				>
					Удалить
				</button>
			</div>
		</div>
	)
}

export default TaskMenu
