import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { BoardProvider } from '../entities/BoardData/BoardContext'
import { UIProvider } from '../shared/model/UIContext'
import { MainPage } from '@pages/MainPage'
import { BoardPage } from '@pages/BoardPage'
import { ToastsProvider } from './providers/ToastsContext'

export function App() {
	return (
		<BrowserRouter>
			<ToastsProvider>
				<BoardProvider>
					<UIProvider>
						<Routes>
							<Route path='/' element={<MainPage />} />

							<Route path='/board/:boardId' element={<BoardPage />} />

							<Route path='/board/:boardId/:taskId?' element={<BoardPage />} />

							<Route path='/*' element={<Navigate to='/' />} />
						</Routes>
					</UIProvider>
				</BoardProvider>
			</ToastsProvider>
		</BrowserRouter>
	)
}
