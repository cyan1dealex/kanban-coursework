import React, { useContext, useState, useCallback, useMemo, memo } from 'react'
import { BoardContext } from '@entities/BoardData/BoardContext'
import classes from './LabelsCreateMenu.module.css'
import { MenuContentLayout } from '@shared/ui/MenuContentLayout'
import { UIContext } from '@shared/model/UIContext'

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

export const LabelsCreateMenu = memo(({ taskId }) => {
	const { createLabel } = useContext(BoardContext)
	const { uiState, toggleSubMenu, closeSubMenu } = useContext(UIContext)

	const [text, setText] = useState('Название метки')
	const [selectedColor, setSelectedColor] = useState(STATIC_COLORS[0])

	const handleCreate = useCallback(() => {
		if (!text.trim()) return

		createLabel(text, selectedColor)
		toggleSubMenu('labels', uiState.subMenu.position, {
			taskId: taskId,
		})
	}, [
		text,
		selectedColor,
		createLabel,
		toggleSubMenu,
		uiState.subMenu?.position,
		taskId,
	])

	const handleBack = useCallback(() => {
		toggleSubMenu('labels', uiState.subMenu.position, {
			taskId: taskId,
		})
	}, [toggleSubMenu, uiState.subMenu?.position, taskId])

	return (
		<MenuContentLayout
			title={'Создание метки'}
			onBack={handleBack}
			onClose={closeSubMenu}
		>
			<div className={classes.labelsCreateMenu}>
				<div className={classes.labelsCreateMenuPreview}>
					<div
						className={classes.labelsCreateMenuPreviewPill}
						style={{ color: selectedColor }}
					>
						<span>{text}</span>
					</div>
				</div>

				<div className={classes.labelsCreateMenuName}>
					<label
						htmlFor='nameLabel'
						className={classes.labelsCreateMenuNameLabel}
					>
						Название
					</label>
					<input
						id='nameLabel'
						className={classes.labelsCreateMenuNameInput}
						onChange={e => setText(e.target.value)}
						value={text}
					/>
				</div>

				<div className={classes.labelsCreateMenuColor}>
					<p className={classes.labelsCreateMenuColorTitle}>Цвет</p>
					<div className={classes.labelsCreateMenuColorInner}>
						{STATIC_COLORS.map(color => (
							<div
								key={color}
								style={{ backgroundColor: color }}
								className={classes.labelsCreateMenuColorPill}
								onClick={() => setSelectedColor(color)}
							></div>
						))}
					</div>
				</div>

				<button
					onClick={handleCreate}
					className={classes.labelsCreateMenuButton}
				>
					Создать метку
				</button>
			</div>
		</MenuContentLayout>
	)
})
