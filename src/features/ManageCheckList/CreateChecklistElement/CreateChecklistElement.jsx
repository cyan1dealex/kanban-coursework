import { BoardContext } from '@entities/BoardData/BoardContext'
import React, {
	useContext,
	useEffect,
	useRef,
	useState,
	useCallback,
	memo,
} from 'react'
import classes from './CreateChecklistElement.module.css'
import { useOnClickOutside } from '@shared/hooks/useOnClickOutside'
import { Textarea } from '@shared/ui/Textarea'

export const CreateChecklistElement = memo(({ taskId, checklistId }) => {
	const { createCheckListElement } = useContext(BoardContext)

	const [isAddingElement, setIsAddingElement] = useState(false)
	const [newElementText, setNewElementText] = useState('')

	const inputRef = useRef(null)
	const createFormRef = useRef(null)

	useEffect(() => {
		if (isAddingElement && inputRef.current) {
			inputRef.current.focus()
		}
	}, [isAddingElement])

	const handleSaveCheckListElement = useCallback(
		(tId, cId) => {
			if (!newElementText.trim()) {
				setIsAddingElement(false)
				return
			}

			createCheckListElement(tId, cId, newElementText.trim())
			setNewElementText('')
		},
		[newElementText, createCheckListElement],
	)

	const handleCancelElementCreate = useCallback(() => {
		setIsAddingElement(false)
		setNewElementText('')
	}, [])

	useOnClickOutside(createFormRef, handleCancelElementCreate)

	if (isAddingElement) {
		return (
			<div className={classes.checkListElementCreateForm} ref={createFormRef}>
				<Textarea
					placeholder='Добавить элемент...'
					value={newElementText}
					onChange={e => setNewElementText(e.target.value)}
					onEnter={() => handleSaveCheckListElement(taskId, checklistId)}
					onEscape={handleCancelElementCreate}
					ref={inputRef}
					className={classes.checkListElementTextarea}
				/>
				<div className={classes.checkListElementNav}>
					<button
						onClick={() => handleSaveCheckListElement(taskId, checklistId)}
						className={classes.checkListElementSaveButton}
					>
						Сохранить
					</button>
					<button
						onClick={handleCancelElementCreate}
						className={classes.checkListElementCancelButton}
					>
						Отмена
					</button>
				</div>
			</div>
		)
	}

	return (
		<button
			onClick={() => setIsAddingElement(true)}
			className={classes.checkListElementAddButton}
		>
			+
		</button>
	)
})
