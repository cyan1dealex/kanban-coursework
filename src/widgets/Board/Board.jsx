import {
	DndContext,
	DragOverlay,
	PointerSensor,
	pointerWithin,
	useSensor,
	useSensors,
} from '@dnd-kit/core'
import {
	horizontalListSortingStrategy,
	SortableContext,
} from '@dnd-kit/sortable'
import { useContext, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BoardContext } from '@entities/BoardData/BoardContext'
import { useBoardDnd } from '@features/DragAndDrop'
import { Column } from '@entities/Column/Column'
import { ColumnOverlay } from '@entities/Column/ColumnOverlay'
import { TaskCardOverlay } from '@entities/Task/TaskCardOverlay'
import { Popover } from '@shared/ui/Popover'
import { TaskMenu } from '@features/TaskActions/TaskMenu'
import { CopyMenu } from '@features/TaskActions/CopyMenu'
import { MoveMenu } from '@features/TaskActions/MoveMenu'
import { DueDateMenu } from '@features/TaskActions/DueDateMenu'
import { LabelsMenu } from '@features/LabelEditor/LabelsMenu'
import { LabelsCreateMenu } from '@features/LabelEditor/LabelsCreateMenu'
import { LabelsEditMenu } from '@features/LabelEditor/LabelsEditMenu'
import { Modal } from '@shared/ui/Modal'
import { TaskModal } from '@widgets/TaskModal'
import { CheckListCreateMenu } from '@features/ManageCheckList/CheckListCreateMenu'
import classes from './Board.module.css'
import { CreateColumn } from '@features/CreateColumn'
import { ColumnMenu } from '@features/ColumnMenu/ColumnMenu'
import { UIContext } from '@shared/model/UIContext'

export const Board = () => {
	const { boardId } = useParams()
	const { taskId } = useParams()
	const navigate = useNavigate()

	const { boardsState, setBoardsState, createCheckList } =
		useContext(BoardContext)

	const { uiState, closeMenu, closeSubMenu } = useContext(UIContext)
	const { menu, subMenu } = uiState

	const {
		activeTask,
		activeColumn,
		handleDragStart,
		handleDragOver,
		handleDragEnd,
	} = useBoardDnd(boardId, setBoardsState)

	const currentBoard = boardsState.boards[boardId]

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 5,
			},
		}),
	)

	const overlayColumnTasks = useMemo(() => {
		if (!activeColumn) return []
		return (
			activeColumn.taskIds?.map(id => boardsState.tasks[id]).filter(Boolean) ||
			[]
		)
	}, [activeColumn, boardsState.tasks])

	if (!currentBoard) return null

	return (
		<>
			<DndContext
				collisionDetection={pointerWithin}
				onDragStart={handleDragStart}
				onDragOver={handleDragOver}
				onDragEnd={handleDragEnd}
				sensors={sensors}
			>
				<div className={classes.board}>
					<SortableContext
						items={currentBoard.columnIds}
						strategy={horizontalListSortingStrategy}
					>
						{currentBoard.columnIds.map(columnId => {
							const column = boardsState.columns[columnId]

							return (
								<Column
									key={column.id}
									boardId={boardId}
									columnId={column.id}
								/>
							)
						})}
					</SortableContext>

					<CreateColumn boardId={boardId} />
				</div>

				{/* Модальное окно задачи */}
				{taskId && boardsState.tasks[taskId] && (
					<Modal
						onClose={() => {
							closeMenu()
							navigate(`/board/${boardId}`)
						}}
					>
						<TaskModal taskId={taskId} />
					</Modal>
				)}

				{menu?.type === 'taskMenu' && (
					<Popover
						position={menu.position}
						onClose={closeMenu}
						hasOverlay={true}
						repositionMode='scroll'
					>
						<TaskMenu
							task={boardsState.tasks[menu.id]}
							position={menu.position}
						/>
					</Popover>
				)}

				{menu?.type == 'columnMenu' && (
					<Popover
						position={menu.position}
						onClose={closeMenu}
						hasOverlay={true}
					>
						<ColumnMenu
							boardId={boardId}
							columnId={menu.id}
							position={menu.position}
						/>
					</Popover>
				)}

				{subMenu?.type == 'labels' && subMenu.position && (
					<Popover
						position={subMenu.position}
						onClose={closeSubMenu}
						isSubMenu={true}
						repositionMode='shift'
					>
						<LabelsMenu task={boardsState.tasks[subMenu.payload.taskId]} />
					</Popover>
				)}

				{subMenu?.type == 'createLabel' && (
					<Popover
						position={subMenu.position}
						onClose={closeSubMenu}
						isSubMenu={true}
						repositionMode='shift'
					>
						<LabelsCreateMenu taskId={subMenu.payload.taskId} />
					</Popover>
				)}

				{subMenu?.type == 'editLabel' && (
					<Popover
						position={subMenu.position}
						onClose={closeSubMenu}
						isSubMenu={true}
						repositionMode='shift'
					>
						<LabelsEditMenu
							label={subMenu.payload.label}
							taskId={subMenu.payload.taskId}
						/>
					</Popover>
				)}

				{subMenu?.type == 'dueDate' && (
					<Popover
						position={subMenu.position}
						onClose={closeSubMenu}
						isSubMenu={true}
						repositionMode='shift'
					>
						<DueDateMenu taskId={subMenu.payload.taskId} />
					</Popover>
				)}

				{subMenu?.type == 'checkLists' && (
					<Popover
						position={subMenu.position}
						onClose={closeSubMenu}
						isSubMenu={true}
					>
						<CheckListCreateMenu
							onAdd={title => createCheckList(subMenu.payload.taskId, title)}
						/>
					</Popover>
				)}

				{subMenu?.type == 'move' && (
					<Popover
						position={subMenu.position}
						onClose={closeSubMenu}
						isSubMenu={true}
						repositionMode='shift'
					>
						<MoveMenu
							task={boardsState.tasks[subMenu.payload.taskId]}
							columnId={subMenu.payload.columnId}
						/>
					</Popover>
				)}

				{subMenu?.type == 'copy' && (
					<Popover
						position={subMenu.position}
						onClose={closeSubMenu}
						isSubMenu={true}
						repositionMode='shift'
					>
						<CopyMenu
							task={boardsState.tasks[subMenu.payload.taskId]}
							columnId={subMenu.payload.columnId}
						/>
					</Popover>
				)}

				<DragOverlay dropAnimation={null}>
					{activeTask ? (
						<TaskCardOverlay task={boardsState.tasks[activeTask]} />
					) : null}
					{activeColumn ? (
						<ColumnOverlay column={activeColumn} tasks={overlayColumnTasks} />
					) : null}
				</DragOverlay>
			</DndContext>
		</>
	)
}
