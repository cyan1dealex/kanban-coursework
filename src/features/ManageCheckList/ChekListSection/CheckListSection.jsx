import React, { useContext, useMemo, memo } from 'react'
import { BoardContext } from '@entities/BoardData/BoardContext'
import classes from './CheckListSection.module.css'
import { CustomCheckbox } from '@shared/ui/CustomCheckbox/CustomCheckbox'
import { CreateChecklistElement } from '@features/ManageCheckList/CreateChecklistElement'
import { EditChecklistElement } from '../EditChecklistElement/EditChecklistElement'

export const CheckListSection = memo(({ checkList, taskId }) => {
	const { toggleChecklistCheckbox } = useContext(BoardContext)

	const [editingElementId, setEditingElementId] = React.useState(null)
	const [isVisible, setIsVisible] = React.useState(true)

	const totalElements = checkList.elements?.length || 0

	const progressBarPercent = useMemo(() => {
		const completedCount =
			checkList.elements?.filter(el => el.isCompleted).length || 0
		return totalElements > 0
			? Math.round((completedCount / totalElements) * 100)
			: 0
	}, [checkList.elements, totalElements])

	return (
		<div key={checkList.id} className={classes.checkList}>
			<div className={classes.checkListHeading}>
				<h3 className={classes.checkListTitle}>{checkList.title}</h3>

				<button onClick={() => setIsVisible(!isVisible)}>
					{isVisible ? 'Скрыть выполненные' : 'Показать выполненные'}
				</button>
			</div>

			<div className={classes.checkListProgressBar}>
				<div className={classes.checkListProgressBarCount}>
					{progressBarPercent}%
				</div>
				<div
					className={classes.checkListProgressBarPill}
					style={{
						'--progress-width': `${progressBarPercent}%`,
						'--progress-color':
							progressBarPercent == 100 ? '#2de054' : '#e02d2d',
					}}
				></div>
			</div>

			<div className={classes.checkListElements}>
				{checkList.elements?.map(element => {
					return !element.isCompleted || isVisible ? (
						<div
							key={element.id}
							className={
								editingElementId === element.id
									? classes.checkListElementEditing
									: classes.checkListElement
							}
						>
							<CustomCheckbox
								id={element.id}
								checked={!!element.isCompleted}
								onChange={() =>
									toggleChecklistCheckbox(taskId, checkList.id, element.id)
								}
							/>
							<EditChecklistElement
								element={element}
								taskId={taskId}
								checklistId={checkList.id}
								editingElementId={editingElementId}
								setEditingElementId={setEditingElementId}
							/>
						</div>
					) : null
				})}
				<CreateChecklistElement taskId={taskId} checklistId={checkList.id} />
			</div>
		</div>
	)
})
