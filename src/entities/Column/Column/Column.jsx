import { useContext, useEffect, useRef, useState } from 'react'
import { TaskCard } from '@entities/Task/TaskCard'
import {
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { BoardContext } from '@entities/BoardData/BoardContext'
import { FiltersContext } from '@features/Filters/model/FiltersContext'
import { AddTask } from '@features/TaskActions/AddTask'
import { MenuDotsButton } from '@shared/ui/MenuDotsButton/MenuDotsButton'
import { UIContext } from '@shared/model/UIContext'
import { RenameColumn } from '@features/RenameColumn/RenameColumn'
import classes from './Column.module.css'

export const Column = ({ boardId, columnId }) => {
	const { boardsState } = useContext(BoardContext)
	const { filteredTasks } = useContext(FiltersContext)
	const { openMenu } = useContext(UIContext)
	const column = boardsState.columns[columnId]

	const columnMenuRef = useRef(null)

	const visibleTaskIds = column.taskIds.filter(taskId => filteredTasks[taskId])

	const visibleTasks = visibleTaskIds.map(taskId => filteredTasks[taskId])

	const { listeners, setNodeRef, transform, isDragging } = useSortable({
		id: columnId,
		data: {
			type: 'column',
			columnId,
		},
	})

	const style = {
		transform: transform
			? `translate3d(${transform.x}px, ${transform.y}px, 0)`
			: undefined,
	}

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={isDragging ? classes.columnDragging : classes.column}
		>
			<div {...listeners} className={classes.columnInner} ref={columnMenuRef}>
				<div className={classes.columnHeader}>
					<RenameColumn column={column} />

					<MenuDotsButton
						onClick={e => {
							e.stopPropagation()
							const menuRect = columnMenuRef.current.getBoundingClientRect()

							openMenu('columnMenu', columnId, {
								top: menuRect.top + window.scrollY,
								left: menuRect.left + window.scrollX,
								width: menuRect.width,
							})
						}}
						className={classes.columnMenuButton}
					/>
				</div>
				{visibleTasks.length > 0 ? (
					<div className={classes.columnTasks}>
						<SortableContext
							items={visibleTasks.map(t => t.id)}
							strategy={verticalListSortingStrategy}
						>
							{visibleTasks.map(task => (
								<TaskCard
									key={task.id}
									boardId={boardId}
									columnId={columnId}
									task={task}
								></TaskCard>
							))}
						</SortableContext>
					</div>
				) : null}

				<AddTask columnId={columnId} />
			</div>
		</div>
	)
}
