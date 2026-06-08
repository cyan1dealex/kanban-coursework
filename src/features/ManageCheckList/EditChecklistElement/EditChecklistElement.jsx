import { BoardContext } from '@entities/BoardData/BoardContext'
import React, {
	useContext,
	useEffect,
	useRef,
	useState,
	useCallback,
	memo,
} from 'react'
import { EditButton } from '@shared/ui/EditButton/EditButton'
import classes from './EditChecklistElement.module.css'
import { useOnClickOutside } from '@shared/hooks/useOnClickOutside'
import { DeleteButtton } from '@shared/ui/DeleteButtton/DeleteButtton'

export const EditChecklistElement = memo(
	({ element, taskId, checklistId, editingElementId, setEditingElementId }) => {
		const { changeElementText, removeChecklistElement } =
			useContext(BoardContext)

		const [editingText, setEditingText] = useState('')

		const inputRef = useRef(null)
		const checklistEditForm = useRef(null)

		const adjustHeight = useCallback(el => {
			el.style.height = '0px'
			el.style.height = el.scrollHeight + 'px'
		}, [])

		const handleInput = useCallback(
			e => {
				setEditingText(e.target.value)
				adjustHeight(e.target)
			},
			[adjustHeight],
		)

		const handleSaveClick = useCallback(
			(tId, cId, eId, text) => {
				changeElementText(tId, cId, eId, text)
				setEditingElementId(null)
			},
			[changeElementText, setEditingElementId],
		)

		const handleCancel = useCallback(() => {
			setEditingText('')
			setEditingElementId(null)
		}, [setEditingElementId])

		const handleEditClick = useCallback(
			e => {
				e.preventDefault()
				setEditingElementId(element.id)
				setEditingText(element.text)
			},
			[element.id, element.text, setEditingElementId],
		)

		useEffect(() => {
			if (editingElementId === element.id && inputRef.current) {
				const el = inputRef.current
				el.select()
				adjustHeight(el)
			}
		}, [editingElementId, element.id, adjustHeight])

		useOnClickOutside(checklistEditForm, handleCancel)

		if (editingElementId === element.id) {
			return (
				<div
					className={classes.checkListElementEditing}
					ref={checklistEditForm}
				>
					<textarea
						type='text'
						ref={inputRef}
						className={classes.checkListElementEditingTextarea}
						value={editingText}
						onChange={handleInput}
						onKeyDown={e => {
							if (e.key === 'Enter') {
								e.preventDefault()
								handleSaveClick(taskId, checklistId, element.id, editingText)
							}
							if (e.key === 'Escape') {
								handleCancel()
							}
						}}
					/>
					<div className={classes.checkListElementEditingNav}>
						<button
							onClick={e =>
								handleSaveClick(taskId, checklistId, element.id, editingText)
							}
							className={classes.checkListElementEditingSaveButton}
						>
							Сохранить
						</button>
						<button
							onClick={handleCancel}
							className={classes.checkListElementEditingCancelButton}
						>
							Отмена
						</button>
					</div>
				</div>
			)
		}

		return (
			<div className={classes.checkListElementInner}>
				<label
					htmlFor={element.id}
					className={classes.checkListElementLabel}
					style={{
						textDecoration: element.isCompleted ? 'line-through' : 'none',
					}}
				>
					{element.text}
				</label>
				<DeleteButtton
					className={classes.checkListElementDeleteButton}
					onClick={() =>
						removeChecklistElement(taskId, checklistId, element.id)
					}
					size={30}
				/>
				<EditButton
					onClick={handleEditClick}
					className={classes.checkListElementEditButton}
				/>
			</div>
		)
	},
)
