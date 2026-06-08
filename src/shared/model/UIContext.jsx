import { createContext, useState, useCallback } from 'react'

export const UIContext = createContext({})

export const UIProvider = ({ children }) => {
	const [uiState, setUiState] = useState({
		menu: null,
		subMenu: null,
		modal: null,
	})

	const openMenu = useCallback((type, id, position) => {
		setUiState({
			menu: { type, id, position },
			subMenu: null,
			modal: null,
		})
	}, [])

	const closeMenu = useCallback(() => {
		setUiState({
			menu: null,
			subMenu: null,
			modal: null,
		})
	}, [])

	const toggleSubMenu = useCallback((type, position, payload = null) => {
		setUiState(prev => {
			if (prev.subMenu?.type === type) {
				return { ...prev, subMenu: null }
			}
			return {
				...prev,
				subMenu: { type, position, payload },
			}
		})
	}, [])

	const closeSubMenu = useCallback(() => {
		setUiState(prev => ({
			...prev,
			subMenu: null,
		}))
	}, [])

	const openModal = useCallback((type, id) => {
		setUiState({
			modal: { type, id },
			menu: null,
			subMenu: null,
		})
	}, [])

	const closeModal = useCallback(() => {
		setUiState(prev => ({ ...prev, modal: null }))
	}, [])

	return (
		<UIContext.Provider
			value={{
				uiState,
				openMenu,
				closeMenu,
				toggleSubMenu,
				closeSubMenu,
				openModal,
				closeModal,
			}}
		>
			{children}
		</UIContext.Provider>
	)
}
