import {
	DndContext,
	DragOverlay,
	KeyboardSensor,
	PointerSensor,
	pointerWithin,
	useSensor,
	useSensors,
} from '@dnd-kit/core'
import {
	horizontalListSortingStrategy,
	SortableContext,
	sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import { useContext } from 'react'
import { useParams } from 'react-router-dom'
import { BoardContext } from '../context/BoardContext'
import useBoardDnd from '../hooks/useBoardDnd'
import Column from './Column'
import ColumnOverlay from './ColumnOverlay'
import TaskCardOverlay from './Task/TaskCardOverlay'
import ContextMenu from './ui/ContextMenu/ContextMenu'
import TaskMenu from './Task/menus/TaskMenu/TaskMenu'
import CopyMenu from './Task/menus/CopyMenu/CopyMenu'
import MoveMenu from './Task/menus/MoveMenu/MoveMenu'
import LabelsMenu from './Task/menus/LabelsMenu/LabelsMenu'
import LabelsCreateMenu from './Task/menus/LabelsCreateMenu/LabelsCreateMenu'
import LabelsEditMenu from './Task/menus/LabelsEditMenu/LabelsEditMenu'
import DueDateMenu from './Task/menus/DueDateMenu/DueDateMenu'

const Board = () => {
	const { boardId } = useParams()

	const {
		boardsState,
		setBoardsState,
		isAddingColumn,
		setIsAddingColumn,
		newTitle,
		setNewTitle,
		addColumn,
		inputRef,
		closeContextMenu,
		removeTask,
	} = useContext(BoardContext)

	const {
		activeTask,
		setActiveTask,
		activeColumn,
		setActiveColumn,
		handleDragStart,
		handleDragOver,
		handleDragEnd,
	} = useBoardDnd(boardId, boardsState, setBoardsState)

	const handleSubmit = () => {
		addColumn(boardId)
		setIsAddingColumn(false)
	}

	const currentBoard = boardsState.boards[boardId]
	const { menu, subMenu } = boardsState.ui

	return (
		<>
			<DndContext
				collisionDetection={pointerWithin}
				onDragStart={handleDragStart}
				onDragOver={handleDragOver}
				onDragEnd={handleDragEnd}
			>
				<div className='board'>
					<SortableContext
						items={currentBoard.columnIds}
						strategy={horizontalListSortingStrategy}
					>
						{currentBoard.columnIds.map(columnId => {
							const column = boardsState.columns[columnId]
							const tasks = column.taskIds
								.map(taskId => boardsState.tasks[taskId])
								.filter(Boolean)

							return (
								<Column
									boardId={boardId}
									id={column.id}
									key={column.id}
									title={column.title}
									tasks={tasks}
								/>
							)
						})}
					</SortableContext>

					{isAddingColumn ? (
						<div className='board__addColumn'>
							<input
								type='text'
								placeholder='Название колонки'
								value={newTitle}
								onChange={e => setNewTitle(e.target.value)}
								ref={inputRef}
								onKeyDown={e => {
									if (e.key === 'Enter') {
										handleSubmit()
									}
									if (e.key === 'Escape') {
										setIsAddingColumn(false)
										setNewTitle('')
									}
								}}
							/>
							<button onClick={handleSubmit}>Добавить </button>
						</div>
					) : (
						<button
							className='board__addColumnButton'
							onClick={() => setIsAddingColumn(true)}
						>
							+ Добавить колонку
						</button>
					)}
				</div>

				{/* Меню задачи */}
				{menu.taskId && (
					<ContextMenu position={menu.position} onClose={closeContextMenu}>
						<TaskMenu
							task={boardsState.tasks[menu.taskId]}
							position={menu.position}
						/>
					</ContextMenu>
				)}

				{/* Попап для меток*/}
				{subMenu.type == 'labels' && (
					<ContextMenu
						position={boardsState.ui.subMenu.position}
						isSubMenu={true}
					>
						<LabelsMenu task={boardsState.tasks[menu.taskId]} />
					</ContextMenu>
				)}

				{/* Попап для создания метки*/}
				{subMenu.type == 'createLabel' && (
					<ContextMenu
						position={boardsState.ui.subMenu.position}
						isSubMenu={true}
					>
						<LabelsCreateMenu />
					</ContextMenu>
				)}

				{/* Попап для редактирвоания метки*/}
				{subMenu.type == 'editLabel' && (
					<ContextMenu
						position={boardsState.ui.subMenu.position}
						isSubMenu={true}
					>
						<LabelsEditMenu label={boardsState.ui.subMenu.data} />
					</ContextMenu>
				)}

				{/* Попап для меток*/}
				{subMenu.type == 'dueDate' && (
					<ContextMenu
						position={boardsState.ui.subMenu.position}
						isSubMenu={true}
					>
						<DueDateMenu task={boardsState.tasks[menu.taskId]} />
					</ContextMenu>
				)}

				{/* Попап для перемещения*/}
				{subMenu.type == 'move' && (
					<ContextMenu
						position={boardsState.ui.subMenu.position}
						isSubMenu={true}
					>
						<MoveMenu
							task={boardsState.tasks[menu.taskId]}
							columnId={menu.columnId}
						/>
					</ContextMenu>
				)}

				{/* Попап для копирования*/}
				{subMenu.type == 'copy' && (
					<ContextMenu
						position={boardsState.ui.subMenu.position}
						isSubMenu={true}
					>
						<CopyMenu
							task={boardsState.tasks[menu.taskId]}
							columnId={menu.columnId}
						/>
					</ContextMenu>
				)}

				{/* Попап для удаления*/}
				{subMenu.type == 'delete' && (
					<ContextMenu
						position={boardsState.ui.subMenu.position}
						isSubMenu={true}
					>
						<button
							onClick={() => {
								removeTask(menu.columnId, menu.taskId)
								closeContextMenu()
							}}
							className='deleteConfirm'
						>
							✔
						</button>
					</ContextMenu>
				)}

				<DragOverlay dropAnimation={null}>
					{activeTask ? (
						<TaskCardOverlay task={boardsState.tasks[activeTask]} />
					) : null}
					{activeColumn ? (
						<ColumnOverlay
							column={activeColumn}
							tasks={
								activeColumn.taskIds
									?.map(id => boardsState.tasks[id])
									.filter(Boolean) || []
							}
						/>
					) : null}
				</DragOverlay>
			</DndContext>
		</>
	)
}

export default Board
