import { useSortable } from '@dnd-kit/sortable'
import { useContext, useRef } from 'react'
import { BoardContext } from '../../context/BoardContext'

const TaskCard = ({ task, columnId }) => {
	const { removeTask, openContextMenu, boardsState } = useContext(BoardContext)
	const { menu } = boardsState.ui
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

	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: task.id,
		data: {
			type: 'task',
			columnId: columnId,
		},
	})

	const cardRef = useRef(null)

	const combinedRef = node => {
		setNodeRef(node)
		cardRef.current = node
	}

	const style = {
		transform: transform
			? `translate3d(${transform.x}px, ${transform.y}px, 0)`
			: undefined,
		opacity: isDragging ? 0.3 : 1,
		backgroundColor: isDragging ? '#6f2338' : '#1f23383a',
		color: isDragging ? 'transparent' : 'black',
		paddingBottom: task.startDate || task.dueDate ? '40px' : undefined,
		paddingTop: labels.length > 0 ? '40px' : undefined,
	}

	return (
		<div
			className='taskCard'
			ref={combinedRef}
			style={style}
			{...listeners}
			{...attributes}
		>
			<div>
				<p className='taskCard__text'>{task.text}</p>
			</div>

			<button
				className='taskCard__edit-button'
				onPointerDown={e => {
					e.stopPropagation()
				}}
				onClick={() => openContextMenu(task.id, columnId, cardRef)}
				style={{ opacity: isDragging ? 0 : 1 }}
			>
				⚙
			</button>
			<div className='taskCard__labels'>
				{labels.map(label => {
					if (!label) return null
					return (
						<div
							key={label?.id}
							className='taskCard__label'
							style={{ backgroundColor: label.color }}
						></div>
					)
				})}
			</div>
			<div className='taskCard__deadline'>
				{deadlineType === 'start' && (
					<div className='taskCard__deadlineStart'>
						⌛ <span>Дата начала: {formatToDayMonth(task.startDate)}</span>
					</div>
				)}

				{deadlineType === 'end' && (
					<div className='taskCard__deadlineEnd'>
						⌛ <span>{formatToDayMonth(task.dueDate)}</span>
					</div>
				)}

				{deadlineType === 'range' && (
					<div className='taskCard__deadlineRange'>
						⌛{' '}
						<span>
							{formatToDayMonth(task.startDate)} -{' '}
							{formatToDayMonth(task.dueDate)}
						</span>
					</div>
				)}
			</div>
		</div>
	)
}

export default TaskCard
