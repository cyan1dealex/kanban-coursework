import { BoardContext } from '@entities/BoardData/BoardContext'
import React, {
	useContext,
	useEffect,
	useRef,
	useState,
	useCallback,
	memo,
} from 'react'
import { useOnClickOutside } from '@shared/hooks/useOnClickOutside'
import classes from './AddTask.module.css'
import { Textarea } from '@shared/ui/Textarea'
import { ToastsContext } from '@app/providers/ToastsContext'
import { FiltersContext } from '@features/Filters/model/FiltersContext'
import { DEFAULT_FILTERS } from '@features/Filters/model/useFilters'

export const AddTask = memo(({ columnId }) => {
	const { addTask } = useContext(BoardContext)
	const { addToast } = useContext(ToastsContext)
	const { globalFilters } = useContext(FiltersContext)

	const [isAddingTask, setIsAddingTask] = useState(false)
	const [text, setText] = useState('')

	const inputRef = useRef(null)
	const addTaskRef = useRef(null)

	useEffect(() => {
		if (isAddingTask && inputRef.current) {
			inputRef.current.focus()
		}
	}, [isAddingTask])

	const handleSubmit = useCallback(() => {
		if (!text.trim()) {
			setIsAddingTask(false)
			return
		}

		const hasActiveFilters =
			JSON.stringify(globalFilters) !== JSON.stringify(DEFAULT_FILTERS)

		if (hasActiveFilters) {
			addToast(
				'Задача создана, но может быть скрыта текущими фильтрами!',
				'warning',
			)
		} else {
			addToast('Задача успешно создана!', 'success')
		}

		if (inputRef.current) {
			inputRef.current.blur()
		}

		addTask(columnId, text)
		setText('')

		setTimeout(() => {
			if (inputRef.current) inputRef.current.focus()
		}, 0)
	}, [text, columnId, globalFilters, addTask, addToast])

	const handleCancel = useCallback(() => {
		setText('')
		setIsAddingTask(false)
	}, [])

	useOnClickOutside(addTaskRef, handleCancel)

	if (isAddingTask) {
		return (
			<div className={classes.columnAddTask} ref={addTaskRef}>
				<Textarea
					ref={inputRef}
					className={classes.columnAddTaskInput}
					placeholder={'Текст задачи'}
					value={text}
					onChange={e => setText(e.target.value)}
					onEnter={handleSubmit}
					onEscape={handleCancel}
				/>
				<div className={classes.columnAddTaskNav}>
					<button
						onClick={handleSubmit}
						className={classes.columnAddTaskButton}
					>
						Добавить
					</button>
					<button
						onClick={handleCancel}
						className={classes.columnAddTaskCancelButton}
					>
						Отмена
					</button>
				</div>
			</div>
		)
	}

	return (
		<button
			className={classes.columnAddTaskPrevButton}
			onClick={() => setIsAddingTask(true)}
		>
			+ Добавить карточку
		</button>
	)
})
