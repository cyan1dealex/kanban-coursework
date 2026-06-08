import React, { useContext, useEffect, useRef, useState, useMemo } from 'react'
import { BoardContext } from '@entities/BoardData/BoardContext'
import { useNavigate, useParams } from 'react-router-dom'
import classes from './TaskMenu.module.css'
import { UIContext } from '@shared/model/UIContext'
import { Textarea } from '@shared/ui/Textarea'
import { DeadlineIcon } from '@shared/assets/icons/DeadlineIcon'
import { ChecklistIcon } from '@shared/assets/icons/ChecklistIcon'
import { DescriptionIcon } from '@shared/assets/icons/DescriptionIcon'
import { CustomCheckbox } from '@shared/ui/CustomCheckbox/CustomCheckbox'

export const TaskMenu = ({ position, task }) => {
	const { boardsState, updateText, toggleTaskDone, removeTask } =
		useContext(BoardContext)

	const { uiState, closeMenu, toggleSubMenu } = useContext(UIContext)
	const { subMenu } = uiState

	const [text, setText] = useState(task.text)
	const textAreaRef = useRef(null)

	const { boardId } = useParams()
	const navigate = useNavigate()

	const columnId = useMemo(() => {
		return Object.values(boardsState.columns).find(col =>
			col.taskIds.includes(task.id),
		)?.id
	}, [boardsState.columns, task.id])

	const labels = useMemo(() => {
		return task.labelIds
			? task.labelIds.map(id => boardsState.labels[id]).filter(Boolean)
			: []
	}, [task.labelIds, boardsState.labels])

	const deadlineType =
		task.startDate && task.dueDate
			? 'range'
			: task.startDate
				? 'start'
				: task.dueDate
					? 'end'
					: null

	const hasDescription = !!task.description
	const checklists = Object.values(task.checkLists || {})

	const formatToDayMonth = dateString => {
		if (!dateString) return ''
		const date = new Date(dateString)
		return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
	}

	const deadlineStyles = useMemo(() => {
		if (task.isDone) {
			return {
				'--deadlinesBGColor': 'rgba(76, 175, 80, 0.2)',
				'--deadlineTextColor': '#4caf50',
				'--deadlinePadding': '4px 8px',
			}
		}

		const now = new Date()
		const start = task.startDate ? new Date(task.startDate) : null
		const end = task.dueDate ? new Date(task.dueDate) : null
		const getDiffDays = date => (date - now) / (1000 * 60 * 60 * 24)

		if (start && end) {
			if (now > end)
				return {
					'--deadlinesBGColor': 'rgba(235, 90, 70, 0.2)',
					'--deadlineTextColor': '#eb5a46',
				}
			if (now >= start)
				return {
					'--deadlinesBGColor': 'rgba(155, 89, 182, 0.2)',
					'--deadlineTextColor': '#9b59b6',
				}
			if (getDiffDays(start) < 2)
				return {
					'--deadlinesBGColor': 'rgba(242, 214, 0, 0.2)',
					'--deadlineTextColor': '#d9b500',
				}
		}

		if (start && !end) {
			if (now >= start)
				return {
					'--deadlinesBGColor': 'rgba(76, 175, 80, 0.2)',
					'--deadlineTextColor': '#4caf50',
				}
			if (getDiffDays(start) < 2)
				return {
					'--deadlinesBGColor': 'rgba(242, 214, 0, 0.2)',
					'--deadlineTextColor': '#d9b500',
				}
		}

		if (end && !start) {
			if (now > end)
				return {
					'--deadlinesBGColor': 'rgba(235, 90, 70, 0.2)',
					'--deadlineTextColor': '#eb5a46',
				}
			if (getDiffDays(end) < 2)
				return {
					'--deadlinesBGColor': 'rgba(242, 214, 0, 0.2)',
					'--deadlineTextColor': '#d9b500',
				}
		}

		return {
			'--deadlinesBGColor': 'transparent',
			'--deadlineTextColor': 'var(--color-text-subtle)',
		}
	}, [task.isDone, task.startDate, task.dueDate])

	useEffect(() => {
		if (textAreaRef.current) {
			textAreaRef.current.select()
		}
	}, [])

	useEffect(() => {
		if (textAreaRef.current) {
			const el = textAreaRef.current
			el.style.height = '0px'
			el.style.height = el.scrollHeight + 'px'
		}
	}, [task.startDate, task.dueDate, labels.length])

	const handleOpenSubMenu = (e, type, payload) => {
		const buttonRect = e.currentTarget.getBoundingClientRect()
		toggleSubMenu(
			type,
			{
				top: buttonRect.top + window.scrollY,
				left: buttonRect.right + window.scrollX + 10,
			},
			payload,
		)
	}

	const handleSubmit = () => {
		updateText(task.id, text)
		closeMenu()
	}

	return (
		<div
			className={classes.taskMenuWrapper}
			onClick={e => e.target === e.currentTarget && closeMenu()}
			onPointerDown={e => e.stopPropagation()}
		>
			<div className={classes.taskMenuContent}>
				<div
					className={classes.taskMenuTextAreaWrapper}
					style={{ width: position.width }}
				>
					<div className={classes.taskMenuTextareaContainer}>
						<CustomCheckbox
							id={`checkbox-${task.id}`}
							checked={!!task.isDone}
							onChange={() => toggleTaskDone(task.id)}
							size={18}
						/>
						<Textarea
							ref={textAreaRef}
							className={classes.taskMenuTextarea}
							value={text}
							onChange={e => setText(e.target.value)}
							onEnter={handleSubmit}
							onEscape={() => closeMenu()}
						/>
					</div>

					{labels.length > 0 ? (
						<div className={classes.taskMenuLabels}>
							{labels.map(
								label =>
									label && (
										<div
											key={label.id}
											className={classes.taskMenuLabel}
											style={{ color: label.color }}
										>
											{label.title}
										</div>
									),
							)}
						</div>
					) : null}

					{(deadlineType || hasDescription || checklists.length > 0) && (
						<div className={classes.taskMenuInfoBlock}>
							{deadlineType && (
								<div
									className={classes.taskMenuDeadlines}
									style={deadlineStyles}
								>
									{deadlineType === 'start' && (
										<div className={classes.taskMenuDeadlinesInner}>
											<DeadlineIcon
												className={classes.taskMenuDeadlineIcon}
												size={16}
											/>
											<span>
												Дата начала: {formatToDayMonth(task.startDate)}
											</span>
										</div>
									)}
									{deadlineType === 'end' && (
										<div className={classes.taskMenuDeadlinesInner}>
											<DeadlineIcon
												className={classes.taskMenuDeadlineIcon}
												size={16}
											/>
											<span>{formatToDayMonth(task.dueDate)}</span>
										</div>
									)}
									{deadlineType === 'range' && (
										<div className={classes.taskMenuDeadlinesInner}>
											<DeadlineIcon
												className={classes.taskMenuDeadlineIcon}
												size={16}
											/>
											<span>
												{formatToDayMonth(task.startDate)} -{' '}
												{formatToDayMonth(task.dueDate)}
											</span>
										</div>
									)}
								</div>
							)}

							{hasDescription && (
								<div className={classes.taskMenuDescription}>
									<DescriptionIcon
										className={classes.taskMenuDescriptionIcon}
										size={16}
									/>
								</div>
							)}

							{checklists.length > 0 ? (
								<div className={classes.taskMenuChecklists}>
									{checklists?.map(checklist => {
										const elements = checklist.elements || []
										const elementsTotalCount = elements.length
										const completedElementsCount = elements.filter(
											el => el.isCompleted,
										).length

										return (
											<div
												className={classes.taskMenuChecklist}
												key={checklist.id}
											>
												<ChecklistIcon
													className={classes.taskMenuChecklistIcon}
													size={16}
												/>
												{elementsTotalCount > 0 && (
													<span>
														{completedElementsCount} / {elementsTotalCount}
													</span>
												)}
											</div>
										)
									})}
								</div>
							) : null}
						</div>
					)}
				</div>
				<button className={classes.saveButton} onClick={handleSubmit}>
					Сохранить
				</button>
			</div>

			<div className={classes.sideActions}>
				<button
					className={classes.actionButton}
					onClick={() => {
						closeMenu()
						navigate(`/board/${boardId}/${task.id}`)
					}}
				>
					Открыть карточку
				</button>
				<button
					className={classes.actionButton}
					onClick={e => handleOpenSubMenu(e, 'labels', { taskId: task.id })}
					style={
						subMenu?.type === 'labels'
							? { borderColor: 'var(--color-accent)' }
							: undefined
					}
				>
					Метки
				</button>
				<button
					className={classes.actionButton}
					onClick={e => handleOpenSubMenu(e, 'dueDate', { taskId: task.id })}
					style={
						subMenu?.type === 'dueDate'
							? { borderColor: 'var(--color-accent)' }
							: undefined
					}
				>
					Дедлайны
				</button>
				<button
					className={classes.actionButton}
					onClick={e =>
						handleOpenSubMenu(e, 'move', { taskId: task.id, columnId })
					}
					style={
						subMenu?.type === 'move'
							? { borderColor: 'var(--color-accent)' }
							: undefined
					}
				>
					Переместить
				</button>
				<button
					className={classes.actionButton}
					onClick={e =>
						handleOpenSubMenu(e, 'copy', { taskId: task.id, columnId })
					}
					style={
						subMenu?.type === 'copy'
							? { borderColor: 'var(--color-accent)' }
							: undefined
					}
				>
					Копировать
				</button>
				<button
					className={classes.actionButton}
					onClick={() => {
						removeTask(columnId, task.id)
						closeMenu()
					}}
				>
					Удалить
				</button>
			</div>
		</div>
	)
}
