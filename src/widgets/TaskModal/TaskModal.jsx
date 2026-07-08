import React, {
	useContext,
	useState,
	useRef,
	useMemo,
	useCallback,
} from 'react'
import { BoardContext } from '@entities/BoardData/BoardContext'
import { DescriptionEditor } from '@shared/ui/DescriptionEditor'
import { CheckListSection } from '@features/ManageCheckList/ChekListSection'
import classes from './TaskModal.module.css'
import { CustomCheckbox } from '@shared/ui/CustomCheckbox/CustomCheckbox'
import { UIContext } from '@shared/model/UIContext'
import { RenameTask } from '@features/TaskActions/RenameTask'

export const TaskModal = ({ taskId }) => {
	const {
		boardsState,
		toggleTaskDone,
		saveDescription,
		createCheckListElement,
	} = useContext(BoardContext)

	const { uiState, toggleSubMenu } = useContext(UIContext)
	const { subMenu } = uiState

	const task = boardsState.tasks[taskId]

	const labels = useMemo(() => {
		return task?.labelIds
			? task.labelIds.map(id => boardsState.labels[id]).filter(Boolean)
			: []
	}, [task?.labelIds, boardsState.labels])

	const [isDescriptionEditing, setIsDescriptionEditing] = useState(false)

	const checklistButtonRef = useRef(null)
	const labelButtonRef = useRef(null)
	const dateButtonRef = useRef(null)

	const getValidDescription = html => {
		if (!html) return null
		const temp = document.createElement('div')
		temp.innerHTML = html
		const text = temp.textContent || temp.innerText || ''
		return text.trim() === '' ? null : html
	}

	const handleSaveDescription = html => {
		const validHtml = getValidDescription(html)
		saveDescription(task.id, validHtml)
		setIsDescriptionEditing(false)
	}

	const handleOpenSubMenu = useCallback(
		(e, type, payload) => {
			const targetElement = e.currentTarget
			if (!targetElement) return

			const buttonRect = targetElement.getBoundingClientRect()

			let coords = {
				top: buttonRect.bottom + window.scrollY + 10,
				left: buttonRect.left + window.scrollX,
			}

			if (payload?.position === 'right') {
				coords = {
					top: buttonRect.top + window.scrollY,
					left: buttonRect.right + window.scrollX + 10,
				}
			}

			toggleSubMenu(type, coords, payload)
		},
		[toggleSubMenu],
	)

	const handleClickDescription = e => {
		if (e.target.closest('a')) return

		const selection = window.getSelection()

		if (selection && selection.toString().length > 0) return

		setIsDescriptionEditing(true)
	}

	const deadlineType =
		task?.startDate && task?.dueDate
			? 'range'
			: task?.startDate
				? 'start'
				: task?.dueDate
					? 'end'
					: null

	const formatToDayMonth = dateString => {
		if (!dateString) return ''
		const date = new Date(dateString)
		return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
	}

	if (!task) return null

	const isChecklistsMenuOpenFromButton =
		subMenu?.type === 'checkLists' && subMenu?.payload?.fromButton === true

	const isLabelsMenuOpenFromButton =
		subMenu?.type === 'labels' && subMenu?.payload?.fromButton === true

	const isDateMenuOpenFromButton =
		subMenu?.type === 'dueDate' && subMenu?.payload?.fromButton === true

	return (
		<div className={classes.taskModal}>
			<div className={classes.taskModalHeader}>
				<CustomCheckbox
					id={taskId}
					checked={!!task.isDone}
					onChange={() => toggleTaskDone(task.id)}
					size={24}
				/>
				<RenameTask task={task} />
			</div>
			<div className={classes.actionButtons}>
				<button
					ref={checklistButtonRef}
					className={classes.actionButton}
					onClick={e =>
						handleOpenSubMenu(e, 'checkLists', {
							taskId: task.id,
							fromButton: true,
						})
					}
					style={
						isChecklistsMenuOpenFromButton
							? { borderColor: 'var(--color-accent)' }
							: undefined
					}
					onPointerDown={e => e.stopPropagation()}
				>
					+ Чек-Лист
				</button>
				<button
					ref={labelButtonRef}
					className={classes.actionButton}
					onClick={e =>
						handleOpenSubMenu(e, 'labels', {
							taskId: task.id,
							fromButton: true,
						})
					}
					style={
						isLabelsMenuOpenFromButton
							? { borderColor: 'var(--color-accent)' }
							: undefined
					}
					onPointerDown={e => e.stopPropagation()}
				>
					+ Метки
				</button>

				<button
					ref={dateButtonRef}
					className={classes.actionButton}
					onClick={e =>
						handleOpenSubMenu(e, 'dueDate', {
							taskId: task.id,
							fromButton: true,
						})
					}
					style={
						isDateMenuOpenFromButton
							? { borderColor: 'var(--color-accent)' }
							: undefined
					}
					onPointerDown={e => e.stopPropagation()}
				>
					+ Даты
				</button>
			</div>

			<div className={classes.labels}>
				<h3 className={classes.labelsTitle}>Метки</h3>
				<div className={classes.labelsList}>
					{labels.map(label => (
						<div
							key={label?.id}
							className={classes.labelsPill}
							style={{ color: label.color }}
							onClick={e => handleOpenSubMenu(e, 'labels', { taskId: task.id })}
							onPointerDown={e => e.stopPropagation()}
						>
							<span>{label.title}</span>
						</div>
					))}
					<div
						className={classes.labelsAddButton}
						onClick={e => handleOpenSubMenu(e, 'labels', { taskId: task.id })}
						onPointerDown={e => e.stopPropagation()}
					>
						+
					</div>
				</div>
			</div>

			{(task.startDate || task.dueDate) && (
				<div className={classes.dueDate}>
					<h3 className={classes.dueDateTitle}>Срок</h3>
					{deadlineType === 'start' && (
						<div
							className={classes.dueDateButton}
							onClick={e =>
								handleOpenSubMenu(e, 'dueDate', {
									taskId: task.id,
									position: 'right',
								})
							}
							onPointerDown={e => e.stopPropagation()}
						>
							<span>Дата начала: {formatToDayMonth(task.startDate)}</span>
						</div>
					)}
					{deadlineType === 'end' && (
						<div
							className={classes.dueDateButton}
							onClick={e =>
								handleOpenSubMenu(e, 'dueDate', {
									taskId: task.id,
									position: 'right',
								})
							}
							onPointerDown={e => e.stopPropagation()}
						>
							<span>{formatToDayMonth(task.dueDate)}</span>
						</div>
					)}
					{deadlineType === 'range' && (
						<div
							className={classes.dueDateButton}
							onClick={e =>
								handleOpenSubMenu(e, 'dueDate', {
									taskId: task.id,
									position: 'right',
								})
							}
							onPointerDown={e => e.stopPropagation()}
						>
							<span>
								{formatToDayMonth(task.startDate)} -{' '}
								{formatToDayMonth(task.dueDate)}
							</span>
						</div>
					)}
				</div>
			)}

			<div className={classes.taskModalDescription}>
				<h3 className={classes.taskModalDescriptionTitle}>Описание</h3>
				{isDescriptionEditing ? (
					<DescriptionEditor
						initialData={task.description}
						onSave={html => handleSaveDescription(html)}
						onCancel={() => setIsDescriptionEditing(false)}
					/>
				) : task.description ? (
					<div
						onClick={handleClickDescription}
						className={classes.taskModalDescriptionField}
						dangerouslySetInnerHTML={{ __html: task.description }}
					></div>
				) : (
					<button
						onClick={handleClickDescription}
						className={classes.taskModalDescriptionButton}
					>
						Добавить описание...
					</button>
				)}
			</div>

			{task.checkLists && (
				<div className={classes.checkLists}>
					{Object.values(task.checkLists)?.map(checkList => (
						<CheckListSection
							key={checkList.id}
							checkList={checkList}
							taskId={task.id}
							createCheckListElement={createCheckListElement}
						/>
					))}
				</div>
			)}
		</div>
	)
}
