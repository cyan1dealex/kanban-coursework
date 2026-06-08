import { useContext } from 'react'
import classes from './TaskCardOverlay.module.css'
import { BoardContext } from '@entities/BoardData/BoardContext'
import { CustomCheckbox } from '@shared/ui/CustomCheckbox/CustomCheckbox'
import { DeadlineIcon } from '@shared/assets/icons/DeadlineIcon'
import { DescriptionIcon } from '@shared/assets/icons/DescriptionIcon'
import { ChecklistIcon } from '@shared/assets/icons/ChecklistIcon'

export const TaskCardOverlay = ({ task }) => {
	const { boardsState } = useContext(BoardContext)

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

	const getDeadlineStyles = () => {
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
	}

	const deadlineStyles = getDeadlineStyles()

	return (
		<div className={classes.taskCardOverlay}>
			<div className={classes.taskCardOverlayInfo}>
				<CustomCheckbox
					id={`checkboxOverlay-${task.id}`}
					checked={!!task.isDone}
					onChange={() => null}
					size={18}
				/>
				<p className={classes.taskCardOverlayText}>{task.text}</p>
			</div>

			{labels.length > 0 ? (
				<div className={classes.taskCardOverlayLabels}>
					{labels.map(label => {
						if (!label) return null
						return (
							<div
								key={label?.id}
								className={classes.taskCardOverlayLabel}
								style={{ color: label.color }}
							>
								{label.title}
							</div>
						)
					})}
				</div>
			) : null}

			{(deadlineType || hasDescription || checklists.length > 0) && (
				<div className={classes.taskCardOverlayInfoBlock}>
					{deadlineType && (
						<div
							className={classes.taskCardOverlayDeadlines}
							style={deadlineStyles}
						>
							{deadlineType === 'start' && (
								<div className={classes.taskCardOverlayDeadlinesInner}>
									<DeadlineIcon
										className={classes.taskCardOverlayDeadlineIcon}
										size={16}
									/>
									<span>Дата начала: {formatToDayMonth(task.startDate)}</span>
								</div>
							)}

							{deadlineType === 'end' && (
								<div className={classes.taskCardOverlayDeadlinesInner}>
									<DeadlineIcon
										className={classes.taskCardOverlayDeadlineIcon}
										size={16}
									/>
									<span>{formatToDayMonth(task.dueDate)}</span>
								</div>
							)}

							{deadlineType === 'range' && (
								<div className={classes.taskCardOverlayDeadlinesInner}>
									<DeadlineIcon
										className={classes.taskCardOverlayDeadlineIcon}
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
						<div className={classes.taskCardOverlayDescription}>
							<DescriptionIcon
								className={classes.taskCardOverlayDescriptionIcon}
								size={16}
							/>
						</div>
					)}

					{checklists.length > 0 ? (
						<div className={classes.taskCardOverlayChecklists}>
							{checklists?.map(checklist => {
								const elements = checklist.elements
								const elementsTotalCount = elements.length
								const completedElementsCount = elements.filter(
									element => element.isCompleted,
								).length

								return (
									<div
										className={classes.taskCardOverlayChecklist}
										key={checklist.id}
									>
										<ChecklistIcon
											className={classes.taskCardOverlayChecklistIcon}
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
	)
}
