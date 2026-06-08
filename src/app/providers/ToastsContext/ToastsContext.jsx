import { createContext, useCallback, useState, useRef, useEffect } from 'react'
import classes from './ToastsContext.module.css'

export const ToastsContext = createContext()

export const ToastsProvider = ({ children }) => {
	const [toasts, setToasts] = useState([])
	const timersRef = useRef({})

	const addToast = useCallback((message, type = 'success') => {
		const id = crypto?.randomUUID() ?? Date.now().toString()

		setToasts(prev => [...prev, { id, message, type }])

		const timer = setTimeout(() => {
			setToasts(prev => prev.filter(toast => toast.id !== id))
			delete timersRef.current[id]
		}, 3000)

		timersRef.current[id] = timer
	}, [])

	useEffect(() => {
		return () => {
			Object.values(timersRef.current).forEach(clearTimeout)
		}
	}, [])

	return (
		<ToastsContext.Provider value={{ addToast }}>
			{children}

			<div className={classes.toastsContainer}>
				{toasts.map(toast => {
					return (
						<div
							key={toast.id}
							className={`${classes.toast} ${classes[toast.type]}`}
						>
							{toast.message}
						</div>
					)
				})}
			</div>
		</ToastsContext.Provider>
	)
}
