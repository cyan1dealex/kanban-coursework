import { TaskCard } from '@entities/Task/TaskCard'
import classes from './ColumnOverlay.module.css'
import { MenuDotsButton } from '@shared/ui/MenuDotsButton/MenuDotsButton'

export const ColumnOverlay = ({ column, tasks }) => {
	return (
		<div className={classes.columnOverlay}>
			<div className={classes.columnOverlayInner}>
				<div className={classes.columnOverlayHeader}>
					<span className={classes.columnOverlayTitle}>{column.title}</span>
					<MenuDotsButton />
				</div>

				{tasks.length > 0 ? (
					<div className={classes.columnOverlayTasks}>
						{tasks.map(task => (
							<TaskCard key={task.id} task={task} columnId={column.id} />
						))}
					</div>
				) : null}

				<button className={classes.columnOverlayButton}>
					+ Добавить карточку
				</button>
			</div>
		</div>
	)
}
