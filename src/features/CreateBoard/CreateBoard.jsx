import React, {
	useContext,
	useEffect,
	useRef,
	useState,
	useCallback,
	memo,
} from 'react'
import { BoardContext } from '@entities/BoardData/BoardContext'
import classes from './CreateBoard.module.css'
import { useNavigate } from 'react-router-dom'
import { InlineInput } from '@shared/ui/InlineInput/InlineInput'

export const CreateBoard = memo(() => {
	const { createBoard } = useContext(BoardContext)
	const [isAddingBoard, setIsAddingBoard] = useState(false)
	const [text, setText] = useState('')
	const navigate = useNavigate()

	const inputRef = useRef()

	useEffect(() => {
		if (isAddingBoard && inputRef.current) {
			inputRef.current.focus()
		}
	}, [isAddingBoard])

	const handleSubmit = useCallback(() => {
		if (!text.trim()) {
			setIsAddingBoard(false)
			return
		}

		const newBoardId = createBoard(text.trim())
		setText('')
		setIsAddingBoard(false)

		if (newBoardId) {
			navigate(`/board/${newBoardId}`)
		}
	}, [text, createBoard, navigate])

	const handleCancel = useCallback(() => {
		setIsAddingBoard(false)
		setText('')
	}, [])

	if (isAddingBoard) {
		return (
			<div className={classes.addBoardWrapper}>
				<div className={classes.addBoardInputWrapper}>
					<InlineInput
						className={classes.addBoardInput}
						placeholder={'Название доски'}
						value={text}
						onChange={e => setText(e.target.value)}
						onEnter={handleSubmit}
						onEscape={handleCancel}
					/>
				</div>
				<div className={classes.addBoardNav}>
					<button className={classes.addBoardBtn} onClick={handleSubmit}>
						Создать
					</button>
					<button className={classes.addBoardCancelBtn} onClick={handleCancel}>
						Отмена
					</button>
				</div>
			</div>
		)
	}

	return (
		<button
			className={classes.addBoardButton}
			onClick={() => setIsAddingBoard(true)}
		>
			+
		</button>
	)
})
