import React, {
	useContext,
	useEffect,
	useRef,
	useState,
	useMemo,
	useCallback,
	memo,
} from 'react'
import { BoardContext } from '@entities/BoardData/BoardContext'
import { useParams } from 'react-router-dom'
import classes from './CopyMenu.module.css'
import { MenuContentLayout } from '@shared/ui/MenuContentLayout'
import { Dropdown } from '@shared/ui/Dropdown'
import { UIContext } from '@shared/model/UIContext'
import { Textarea } from '@shared/ui/Textarea'

export const CopyMenu = memo(({ task, columnId }) => {
	const { boardsState, copyTask } = useContext(BoardContext)
	const { closeSubMenu, closeMenu } = useContext(UIContext)
	const { boardId } = useParams()

	const [text, setText] = useState(task.text)
	const [selectedBoardId, setSelectedBoardId] = useState(boardId)
	const [selectedColumnId, setSelectedColumnId] = useState(columnId)

	const [position, setPosition] = useState(() => {
		return boardsState.columns[selectedColumnId].taskIds.indexOf(task.id) + 1
	})
	const textAreaRef = useRef(null)

	const tasksCount = boardsState.columns[selectedColumnId].taskIds.length
	const maxPos = tasksCount + 1

	// ОПТИМИЗАЦИЯ: кэшируем массив позиций
	const positions = useMemo(() => {
		return Array.from({ length: maxPos }, (_, i) => i + 1)
	}, [maxPos])

	// ОПТИМИЗАЦИЯ: кэшируем boardOptions
	const boardOptions = useMemo(() => {
		return Object.keys(boardsState.boards).map(id => ({
			id: id,
			label: `${boardsState.boards[id].title} ${id === boardId ? '(тек.)' : ''}`,
		}))
	}, [boardsState.boards, boardId])

	// ОПТИМИЗАЦИЯ: кэшируем columnOptions
	const columnOptions = useMemo(() => {
		return boardsState.boards[selectedBoardId].columnIds.map(id => ({
			id: id,
			label: boardsState.columns[id].title,
		}))
	}, [boardsState.boards, boardsState.columns, selectedBoardId])

	// ОПТИМИЗАЦИЯ: застабилизировали экшен копирования
	const handleCopy = useCallback(() => {
		copyTask(task, text, selectedColumnId, position)
		closeMenu()
	}, [copyTask, task, text, selectedColumnId, position, closeMenu])

	useEffect(() => {
		if (textAreaRef.current) {
			textAreaRef.current.select()
		}
	}, [])

	return (
		<MenuContentLayout title={'Копирование карточки'} onClose={closeSubMenu}>
			<div className={classes.copyMenu}>
				<div className={classes.copyMenuNameBlock}>
					<p className={classes.copyMenuNameTitle}>Имя</p>
					<Textarea
						ref={textAreaRef}
						className={classes.copyMenuTextarea}
						value={text}
						onChange={e => setText(e.target.value)}
					/>
				</div>
				<p className={classes.copyMenuLabel}>Копировать в...</p>
				<div className={classes.copyMenuBoard}>
					<p className={classes.copyMenuBoardDropdownTitle}>Доска</p>
					<Dropdown
						title={boardsState.boards[selectedBoardId].title}
						options={boardOptions}
						onSelect={setSelectedBoardId}
					/>
				</div>
				<div className={classes.copyMenuListPositionBlock}>
					<div className={classes.copyMenuList}>
						<p className={classes.copyMenuListDropdownTitle}>Список</p>
						<Dropdown
							title={boardsState.columns[selectedColumnId].title}
							options={columnOptions}
							onSelect={setSelectedColumnId}
						/>
					</div>
					<div className={classes.copyMenuPosition}>
						<p className={classes.copyMenuPositionDropdownTitle}>Позиция</p>
						<Dropdown
							title={position}
							options={positions}
							onSelect={setPosition}
						/>
					</div>
				</div>
				<button onClick={handleCopy} className={classes.copyMenuButton}>
					Создать карточку
				</button>
			</div>
		</MenuContentLayout>
	)
})
