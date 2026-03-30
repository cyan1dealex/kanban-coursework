import React, { useContext, useState } from 'react'
import classes from './LabelsCreateMenu.module.css'
import { BoardContext } from '../../../../context/BoardContext'

const LabelsCreateMenu = () => {
	const { boardsState, openSubMenu, closeSubMenu, createLabel } =
		useContext(BoardContext)
	const { labels } = boardsState

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

	const [text, setText] = useState('Название метки')
	const [selectedColor, setSelectedColor] = useState(colors[0])

	return (
		<div className={classes.labelsCreateMenu}>
			<div className={classes.labelsCreateMenuHeading}>
				<button
					onClick={() => {
						openSubMenu('labels')
					}}
					className={classes.labelsCreateMenuBackButton}
				>
					⬅
				</button>

				<h2 className={classes.labelsCreateMenuTitle}>Создание метки</h2>

				<button
					onClick={closeSubMenu}
					className={classes.labelsCreateMenuCloseButton}
				>
					x
				</button>
			</div>

			<div className={classes.labelsCreateMenuPreview}>
				<div
					className={classes.labelsCreateMenuPreviewPill}
					style={{ backgroundColor: selectedColor }}
				>
					{text}
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
					className={classes.labelsCreateMenuNameLabel}
					onChange={e => setText(e.target.value)}
					value={text}
				/>
			</div>

			<div className={classes.labelsCreateMenuColor}>
				<p className={classes.labelsCreateMenuColorTitle}>Цвет</p>
				<div className={classes.labelsCreateMenuColorInner}>
					{colors.map(color => (
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
				onClick={() => {
					createLabel(text, selectedColor)
					openSubMenu('labels')
				}}
				className={classes.labelsCreateMenuButton}
			>
				Создать метку
			</button>
		</div>
	)
}

export default LabelsCreateMenu
