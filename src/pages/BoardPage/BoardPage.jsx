import React, { useContext, useRef, useCallback } from 'react'
import { Board } from '@widgets/Board'
import { useNavigate, useParams } from 'react-router-dom'
import { BoardContext } from '@entities/BoardData/BoardContext'
import { RenameBoard } from '@features/RenameBoard/RenameBoard'
import { MenuDotsButton } from '@shared/ui/MenuDotsButton/MenuDotsButton'
import { UIContext } from '@shared/model/UIContext'
import { Popover } from '@shared/ui/Popover'
import { Logo } from '@shared/ui/Logo'
import { FilterButton } from '@shared/ui/FilterButton/FilterButton'
import { FiltersMenu } from '@features/Filters/ui/FiltersMenu'
import { FiltersProvider } from '@features/Filters/model/FiltersContext'
import classes from './BoardPage.module.css'
import { SearchTask } from '@features/Filters/ui/SearchTask'
import { useOnClickOutside } from '@shared/hooks/useOnClickOutside'

export const BoardPage = () => {
	const { boardsState, removeBoard } = useContext(BoardContext)
	const { uiState, openMenu, closeMenu } = useContext(UIContext)
	const { menu } = uiState

	const { boardId } = useParams()
	const board = boardsState.boards[boardId]

	const navigate = useNavigate()

	const boardMenuButtonRef = useRef()
	const deleteButtonRef = useRef()
	const filterButtonRef = useRef()

	// ОПТИМИЗАЦИЯ: застабилизировали удаление доски
	const handleDelete = useCallback(() => {
		navigate('/')
		removeBoard(boardId)
		closeMenu()
	}, [navigate, removeBoard, boardId, closeMenu])

	// ОПТИМИЗАЦИЯ: застабилизировали меню доски
	const handleOpenMenu = useCallback(
		e => {
			e.stopPropagation()

			if (menu?.type === 'boardMenu') {
				closeMenu()
				return
			}

			const menuRect = boardMenuButtonRef.current.getBoundingClientRect()

			openMenu('boardMenu', boardId, {
				top: menuRect.top + window.scrollY,
				left: menuRect.right + window.scrollX + 10,
			})
		},
		[menu?.type, openMenu, boardId, closeMenu],
	)

	// ОПТИМИЗАЦИЯ: застабилизировали открытие фильтра
	const handleOpenFilters = useCallback(
		e => {
			e.stopPropagation()

			if (menu?.type === 'filters') {
				closeMenu()
				return
			}

			const filtersRect = filterButtonRef.current.getBoundingClientRect()

			openMenu('filters', boardId, {
				top: filtersRect.bottom + window.scrollY + 10,
				left: filtersRect.left + window.scrollX,
			})
		},
		[menu?.type, openMenu, boardId, closeMenu],
	)

	useOnClickOutside(deleteButtonRef, closeMenu, [boardMenuButtonRef])

	if (!board) return null

	return (
		<FiltersProvider boardId={boardId} tasks={boardsState.tasks}>
			<div className={classes.boardPage}>
				<div className={classes.main}>
					<header className={classes.header}>
						<Logo className={classes.boardPageLogo} />
						<div className={classes.boardPageNav}>
							<SearchTask />

							<div
								className={classes.boardPageFilterButtonWrapper}
								ref={filterButtonRef}
							>
								<FilterButton
									className={classes.boardPageFilterButton}
									onClick={handleOpenFilters}
								/>
							</div>
						</div>
					</header>
					<main className={classes.boardContainer}>
						<div className={classes.boardInner}>
							<div className={classes.boardHeader}>
								<RenameBoard board={board} />

								<div
									className={classes.menuDotsButtonWrapper}
									ref={boardMenuButtonRef}
								>
									<MenuDotsButton
										onClick={handleOpenMenu}
										className={classes.boardMenuButton}
									/>
								</div>
							</div>
							<div className={classes.boardContent}>
								<Board />
							</div>
						</div>
					</main>
				</div>

				{/* Меню доски для удаления */}
				{menu?.type === 'boardMenu' && (
					<Popover
						position={menu.position}
						onClose={closeMenu}
						hasOverlay={false}
					>
						<button
							ref={deleteButtonRef}
							className={classes.boardDeleteButton}
							onClick={handleDelete}
						>
							Удалить доску
						</button>
					</Popover>
				)}

				{/* Фильтры */}
				{menu?.type === 'filters' && (
					<Popover
						position={menu.position}
						onClose={closeMenu}
						repositionMode='crop'
					>
						<FiltersMenu onClose={closeMenu} excludeRef={filterButtonRef} />
					</Popover>
				)}
			</div>
		</FiltersProvider>
	)
}
