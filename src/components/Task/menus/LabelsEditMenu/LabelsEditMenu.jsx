import React, { useContext, useState } from 'react'
import classes from './labelsEditMenu.module.css'
import { BoardContext } from '../../../../context/BoardContext'

const LabelsEditMenu = ({ label }) => {
	const { boardsState, openSubMenu, closeSubMenu, editLabel, removeLabel } =
		useContext(BoardContext)

	const colors = [
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

	const [text, setText] = useState(label.title)
	const [selectedColor, setSelectedColor] = useState(label.color)

	return (
		<div className={classes.labelsEditMenu}>
			<div className={classes.labelsEditMenuHeading}>
				<button
					onClick={() => {
						openSubMenu('labels')
					}}
					className={classes.labelsEditMenuBackButton}
				>
					⬅
				</button>

				<h2 className={classes.labelsEditMenuTitle}>Редактирование метки</h2>

				<button
					onClick={closeSubMenu}
					className={classes.labelsEditMenuCloseButton}
				>
					x
				</button>
			</div>

			<div className={classes.labelsEditMenuPreview}>
				<div
					className={classes.labelsEditMenuPreviewPill}
					style={{ backgroundColor: selectedColor }}
				>
					{text}
				</div>
			</div>

			<div className={classes.labelsEditMenuName}>
				<label htmlFor='nameLabel' className={classes.labelsEditMenuNameLabel}>
					Название
				</label>
				<input
					id='nameLabel'
					className={classes.labelsEditMenuNameLabel}
					onChange={e => setText(e.target.value)}
					value={text}
				/>
			</div>

			<div className={classes.labelsEditMenuColor}>
				<p className={classes.labelsEditMenuColorTitle}>Цвет</p>
				<div className={classes.labelsEditMenuColorInner}>
					{colors.map(color => (
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
					onClick={() => {
						editLabel(label, text, selectedColor)
						openSubMenu('labels')
					}}
					className={classes.labelsEditMenuButton}
				>
					Сохранить
				</button>
				<button
					onClick={() => {
						removeLabel(label)
						openSubMenu('labels')
					}}
					className={classes.labelsEditMenuButton}
				>
					Удалить
				</button>
			</div>
		</div>
	)
}

export default LabelsEditMenu
