import TaskCard from './Task/TaskCard'

const ColumnOverlay = ({ column, tasks }) => {
	return (
		<div className='columnOverlay'>
			<div className='columnOverlay__inner'>
				<div className='columnOverlay__title'>
					<span className='columnOverlay__input'>{column.title}</span>
				</div>

				<div className='columnOverlay__tasks'>
					{tasks.map(task => (
						<TaskCard key={task.id} task={task} columnId={column.id} />
					))}
				</div>

				<button>+ Добавить карточку</button>
			</div>
		</div>
	)
}

export default ColumnOverlay
