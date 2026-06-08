import { useSortable } from '@dnd-kit/sortable'
import { useContext, useEffect, useRef } from 'react'
import { BoardContext } from '@entities/BoardData/BoardContext'
import { useNavigate, useParams } from 'react-router-dom'
import { CustomCheckbox } from '@shared/ui/CustomCheckbox/CustomCheckbox'
import { EditButton } from '@shared/ui/EditButton/EditButton'
import { UIContext } from '@shared/model/UIContext'
import classes from './TaskCard.module.css'
import { DeadlineIcon } from '@shared/assets/icons/DeadlineIcon'
import { DescriptionIcon } from '@shared/assets/icons/DescriptionIcon'
import { ChecklistIcon } from '@shared/assets/icons/ChecklistIcon'

export const TaskCard = ({ task, columnId }) => {
	const { boardsState, toggleTaskDone } = useContext(BoardContext)
	const { openMenu, closeMenu } = useContext(UIContext)

	const navigate = useNavigate()
	const { boardId } = useParams()

	const cardRef = useRef(null)
	const wasDragging = useRef(false)

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

	const hasDescription = !!task.description

	const checklists = Object.values(task.checkLists || {})

	const formatToDayMonth = dateString => {
		if (!dateString) return ''
		const date = new Date(dateString)

		return date.toLocaleDateString('ru-RU', {
			day: 'numeric',
			month: 'long',
		})
	}

	const { attributes, listeners, setNodeRef, isDragging } = useSortable({
		id: task.id,
		data: {
			type: 'task',
			columnId: columnId,
		},
	})

	const combinedRef = node => {
		setNodeRef(node)
		cardRef.current = node
	}

	useEffect(() => {
		if (isDragging) {
			wasDragging.current = true
		} else {
			setTimeout(() => {
				wasDragging.current = false
			}, 50)
		}
	}, [isDragging])

	const handleClick = () => {
		if (wasDragging.current) return

		closeMenu()
		navigate(`/board/${boardId}/${task.id}`)
	}

	const getDeadlineStyles = () => {
		// если задача выполнена
		if (task.isDone) {
			return {
				'--deadlinesBGColor': 'rgba(76, 175, 80, 0.2)',
				'--deadlineTextColor': '#4caf50',
			}
		}

		const now = new Date()
		const start = task.startDate ? new Date(task.startDate) : null
		const end = task.dueDate ? new Date(task.dueDate) : null

		const getDiffDays = date => (date - now) / (1000 * 60 * 60 * 24)

		// range
		if (start && end) {
			if (now > end)
				return {
					// если конец пропущен
					'--deadlinesBGColor': 'rgba(235, 90, 70, 0.2)',
					'--deadlineTextColor': '#eb5a46',
				}
			if (now >= start)
				return {
					// если начало насутпило
					'--deadlinesBGColor': 'rgba(155, 89, 182, 0.2)', // Фиолетовый
					'--deadlineTextColor': '#9b59b6',
				}
			if (getDiffDays(start) < 2)
				return {
					// если до начала близко
					'--deadlinesBGColor': 'rgba(242, 214, 0, 0.2)',
					'--deadlineTextColor': '#d9b500',
				}
		}

		// start
		if (start && !end) {
			if (now >= start)
				return {
					// если начало наступило
					'--deadlinesBGColor': 'rgba(76, 175, 80, 0.2)',
					'--deadlineTextColor': '#4caf50',
				}
			if (getDiffDays(start) < 2)
				return {
					// если до начала близко
					'--deadlinesBGColor': 'rgba(242, 214, 0, 0.2)',
					'--deadlineTextColor': '#d9b500',
				}
		}

		// end
		if (end && !start) {
			if (now > end)
				return {
					// если конец пропущен
					'--deadlinesBGColor': 'rgba(235, 90, 70, 0.2)',
					'--deadlineTextColor': '#eb5a46',
				}
			if (getDiffDays(end) < 2)
				return {
					// если конец близко
					'--deadlinesBGColor': 'rgba(242, 214, 0, 0.2)',
					'--deadlineTextColor': '#d9b500',
				}
		}

		// по умолчанию
		return {
			'--deadlinesBGColor': 'transparent',
			'--deadlineTextColor': 'var(--color-text-subtle)',
		}
	}

	const deadlineStyles = getDeadlineStyles()

	return (
		<div
			className={isDragging ? classes.taskCardDragging : classes.taskCard}
			ref={combinedRef}
			{...listeners}
			{...attributes}
			onClick={handleClick}
		>
			<div className={classes.taskCardInfo}>
				<span onClick={e => e.stopPropagation()}>
					<CustomCheckbox
						id={`checkbox-${task.id}`}
						checked={!!task.isDone}
						onChange={() => toggleTaskDone(task.id)}
						size={18}
					/>
				</span>
				<p className={classes.taskCardText}>{task.text}</p>
			</div>

			{labels.length > 0 ? (
				<div className={classes.taskCardLabels}>
					{labels.map(label => {
						if (!label) return null
						return (
							<div
								key={label?.id}
								className={classes.taskCardLabel}
								style={{ color: label.color }}
							>
								{label.title}
							</div>
						)
					})}
				</div>
			) : null}

			{(deadlineType || hasDescription || checklists.length > 0) && (
				<div className={classes.taskCardInfoBlock}>
					{deadlineType && (
						<div className={classes.taskCardDeadlines} style={deadlineStyles}>
							{deadlineType === 'start' && (
								<div className={classes.taskCardDeadlinesInner}>
									<DeadlineIcon
										className={classes.taskCardDeadlineIcon}
										size={16}
									/>
									<span>Дата начала: {formatToDayMonth(task.startDate)}</span>
								</div>
							)}

							{deadlineType === 'end' && (
								<div className={classes.taskCardDeadlinesInner}>
									<DeadlineIcon
										className={classes.taskCardDeadlineIcon}
										size={16}
									/>
									<span>{formatToDayMonth(task.dueDate)}</span>
								</div>
							)}

							{deadlineType === 'range' && (
								<div className={classes.taskCardDeadlinesInner}>
									<DeadlineIcon
										className={classes.taskCardDeadlineIcon}
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
						<div className={classes.taskCardDescription}>
							<DescriptionIcon
								className={classes.taskCardDescriptionIcon}
								size={16}
							/>
						</div>
					)}

					{checklists.length > 0 ? (
						<div className={classes.taskCardChecklists}>
							{checklists?.map(checklist => {
								const elements = checklist.elements
								const elementsTotalCount = elements.length
								const completedElementsCount = elements.filter(
									element => element.isCompleted,
								).length

								return (
									<div className={classes.taskCardChecklist} key={checklist.id}>
										<ChecklistIcon
											className={classes.taskCardChecklistIcon}
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

			{!isDragging && (
				<EditButton
					onClick={e => {
						e.stopPropagation()
						const rect = cardRef.current.getBoundingClientRect()

						openMenu('taskMenu', task.id, {
							top: rect.top + window.scrollY,
							left: rect.left + window.scrollX,
							width: rect.width,
							height: rect.height,
						})
					}}
					className={classes.taskCardEditButton}
				/>
			)}
		</div>
	)
}
