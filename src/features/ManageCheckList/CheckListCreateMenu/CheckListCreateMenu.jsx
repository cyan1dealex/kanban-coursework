import React, { useContext, useState, useCallback, memo } from 'react'
import classes from './CheckListCreateMenu.module.css'
import { MenuContentLayout } from '@shared/ui/MenuContentLayout'
import { UIContext } from '@shared/model/UIContext'
import { ToastsContext } from '@app/providers/ToastsContext'

export const CheckListCreateMenu = memo(({ onAdd }) => {
	const { closeSubMenu } = useContext(UIContext)
	const { addToast } = useContext(ToastsContext)

	const [title, setTitle] = useState('Чек-лист')

	const handleSubmit = useCallback(
		e => {
			e.preventDefault()

			if (title.trim()) {
				onAdd(title.trim())
				closeSubMenu()
				addToast('Чеклист успешно создан!', 'success')
			}
		},
		[title, onAdd, closeSubMenu, addToast],
	)

	return (
		<MenuContentLayout title={'Добавление списка задач'} onClose={closeSubMenu}>
			<div className={classes.CheckListCreateMenu}>
				<form
					onSubmit={handleSubmit}
					className={classes.CheckListCreateMenuForm}
				>
					<fieldset className={classes.CheckListCreateMenuFieldset}>
						<label
							className={classes.CheckListCreateMenuLabel}
							htmlFor='checklist-title'
						>
							Название
						</label>
						<input
							id='checklist-title'
							type='text'
							value={title}
							onChange={e => setTitle(e.target.value)}
							className={classes.CheckListCreateMenuInput}
							autoFocus
							onFocus={e => e.target.select()}
						/>
					</fieldset>

					<button
						type='submit'
						className={classes.CheckListCreateMenuSubmitBtn}
					>
						Добавить
					</button>
				</form>
			</div>
		</MenuContentLayout>
	)
})
