import { Link } from 'react-router-dom'
import { useContext, useCallback } from 'react'
import { BoardContext } from '@entities/BoardData/BoardContext'
import classes from './MainPage.module.css'
import { CreateBoard } from '@features/CreateBoard'
import { MenuDotsButton } from '@shared/ui/MenuDotsButton/MenuDotsButton'
import { UIContext } from '@shared/model/UIContext'
import { BoardMenu } from '@features/BoardMenu'
import { Popover } from '@shared/ui/Popover'

export const MainPage = () => {
	const { boardsState } = useContext(BoardContext)
	const { uiState, openMenu, closeMenu } = useContext(UIContext)
	const { menu } = uiState

	// ОПТИМИЗАЦИЯ: застабилизировали функцию открытия меню
	const handleOpenMenu = useCallback(
		(e, boardId) => {
			e.preventDefault()
			e.stopPropagation()

			const cardElement = e.target.closest('a')
			const cardRect = cardElement.getBoundingClientRect()

			openMenu('boardMenu', boardId, {
				top: cardRect.top + window.scrollY,
				left: cardRect.left + window.scrollX,
				width: cardRect.width,
				height: cardRect.height,
			})
		},
		[openMenu],
	)

	return (
		<div className={classes.mainPage}>
			<h1 className={classes.mainPageTitle}>Список досок</h1>

			<div className={classes.mainPageList}>
				{boardsState.boardOrder.map(boardId => {
					const currentBoard = boardsState.boards[boardId]

					return (
						<Link
							key={boardId}
							to={`/board/${boardId}`}
							className={classes.mainPageBoardCard}
						>
							<span>{currentBoard.title}</span>

							<MenuDotsButton
								onClick={e => handleOpenMenu(e, boardId)}
								className={classes.mainPageBoardMenuButton}
							/>
						</Link>
					)
				})}

				<CreateBoard />
			</div>

			{menu?.type === 'boardMenu' && (
				<Popover position={menu.position} onClose={closeMenu} hasOverlay={true}>
					<BoardMenu boardId={menu.id} position={menu.position} />
				</Popover>
			)}
		</div>
	)
}
