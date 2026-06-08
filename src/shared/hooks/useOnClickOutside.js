import { useEffect, useRef } from 'react'

export const useOnClickOutside = (ref, handle, excludeRefs) => {
	const handlerRef = useRef(handle)

	useEffect(() => {
		handlerRef.current = handle
	}, [handle])

	useEffect(() => {
		const listener = e => {
			if (!ref.current || ref.current.contains(e.target)) {
				return
			}

			const isExcluded = excludeRefs?.some(excludeRef => {
				return excludeRef?.current && excludeRef?.current.contains(e.target)
			})

			if (isExcluded) {
				return
			}

			handlerRef.current(e)
		}

		document.addEventListener('pointerdown', listener)

		return () => {
			document.removeEventListener('pointerdown', listener)
		}
	}, [ref, excludeRefs])
}
