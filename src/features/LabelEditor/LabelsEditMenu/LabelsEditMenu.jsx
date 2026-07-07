import React, {
	useContext,
	useEffect,
	useRef,
	useState,
	useCallback,
	memo,
} from 'react'
import { BoardContext } from '@entities/BoardData/BoardContext'
import { MenuContentLayout } from '@shared/ui/MenuContentLayout'
import { UIContext } from '@shared/model/UIContext'
import classes from './LabelsEditMenu.module.css'

const STATIC_COLORS = [
	'#F44336',
	'#3F51B5',
	'#009688',
	'#FFEB33',
	'#E91E63',
	'#2196F3',
	'#5AB963',
	'#FFC107',
	'#9C27B0',
	'#03A9F4',
	'#8BC34A',
	'#FF9800',
	'#673AB7',
	'#00BCD4',
	'#CDDC39',
	'#ff5722',
]

export const LabelsEditMenu = memo(({ label, taskId }) => {
	const { editLabel, removeLabel } = useContext(BoardContext)
	const { uiState, toggleSubMenu, closeSubMenu } = useContext(UIContext)

	const inputRef = useRef(null)

	const [text, setText] = useState(label.title)
	const [selectedColor, setSelectedColor] = useState(label.color)

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus()
		}
	}, [])

	const handleBack = useCallback(() => {
		toggleSubMenu('labels', uiState.subMenu.position, {
			taskId: taskId,
		})
	}, [toggleSubMenu, uiState.subMenu?.position, taskId])

	const handleSave = useCallback(() => {
		editLabel(label, text, selectedColor)
		toggleSubMenu('labels', uiState.subMenu.position, {
			taskId: taskId,
		})
	}, [
		editLabel,
		label,
		text,
		selectedColor,
		toggleSubMenu,
		uiState.subMenu?.position,
		taskId,
	])

	const handleDelete = useCallback(() => {
		removeLabel(label)
		toggleSubMenu('labels', uiState.subMenu.position, {
			taskId: taskId,
		})
	}, [removeLabel, label, toggleSubMenu, uiState.subMenu?.position, taskId])

	return (
		<MenuContentLayout
			title={'Редактирование метки'}
			onBack={handleBack}
			onClose={closeSubMenu}
		>
			<div className={classes.labelsEditMenu}>
				<div className={classes.labelsEditMenuPreview}>
					<div
						className={classes.labelsEditMenuPreviewPill}
						style={{ color: selectedColor }}
					>
						<span>{text}</span>
					</div>
				</div>

				<div className={classes.labelsEditMenuName}>
					<label
						htmlFor='nameLabel'
						className={classes.labelsEditMenuNameLabel}
					>
						Название
					</label>
					<input
						id='nameLabel'
						ref={inputRef}
						className={classes.labelsEditMenuNameInput}
						onChange={e => setText(e.target.value)}
						value={text}
					/>
				</div>

				<div className={classes.labelsEditMenuColor}>
					<p className={classes.labelsEditMenuColorTitle}>Цвет</p>
					<div className={classes.labelsEditMenuColorInner}>
						{STATIC_COLORS.map(color => (
							<div
								key={color}
								style={{ backgroundColor: color }}
								className={classes.labelsEditMenuColorPill}
								onClick={() => setSelectedColor(color)}
							></div>
						))}
					</div>
				</div>
				<div className={classes.labelsEditMenuButtons}>
					<button
						onClick={handleSave}
						className={classes.labelsEditMenuSaveButton}
					>
						Сохранить
					</button>
					<button
						onClick={handleDelete}
						className={classes.labelsEditMenuDeleteButton}
					>
						Удалить
					</button>
				</div>
			</div>
		</MenuContentLayout>
	)
})
