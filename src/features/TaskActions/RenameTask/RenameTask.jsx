import { BoardContext } from '@entities/BoardData/BoardContext'
import { Textarea } from '@shared/ui/Textarea'
import React, {
	useContext,
	useEffect,
	useRef,
	useState,
	useCallback,
	memo,
} from 'react'
import classes from './RenameTask.module.css'

export const RenameTask = memo(({ task }) => {
	const { updateText } = useContext(BoardContext)

	const [isEditing, setIsEditing] = useState(false)
	const [text, setText] = useState(task.text)

	const inputRef = useRef(null)

	// ОПТИМИЗАЦИЯ: стабилизируем сабмит
	const handleSubmit = useCallback(
		e => {
			updateText(task.id, e.target.value)
			setIsEditing(false)
		},
		[task.id, updateText],
	)

	// ОПТИМИЗАЦИЯ: стабилизируем отмену
	const handleCancel = useCallback(() => {
		setIsEditing(false)
		setText('')
	}, [])

	useEffect(() => {
		if (isEditing && inputRef.current) {
			const el = inputRef.current
			el.select()
		}
	}, [isEditing])

	if (isEditing) {
		return (
			<Textarea
				ref={inputRef}
				className={classes.titleEditingTextarea}
				value={text}
				onChange={e => setText(e.target.value)}
				onBlur={handleSubmit}
				onEnter={handleSubmit}
				onEscape={handleCancel}
			/>
		)
	}

	return (
		<h2 onClick={() => setIsEditing(true)} className={classes.title}>
			{task.text}
		</h2>
	)
})
