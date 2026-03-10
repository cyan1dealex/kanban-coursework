import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Board from "./components/Board"
import { BoardProvider } from "./context/BoardContext"
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import BoardPage from "./pages/BoardPage";

function App() {
	const isAuth = true;

	return (
		<BrowserRouter>
			<BoardProvider>
				<Routes>
					<Route 
						path="/login" 
						element={<LoginPage />}
					/>

					<Route 
						path="/" 
						element={isAuth ? <MainPage /> : <Navigate to="/login" />}
					/>

					<Route 
						path="/board/:boardId" 
						element={isAuth ? <BoardPage /> : <Navigate to="/login" />}
					/>

					<Route 
						path="/*" 
						element={<Navigate to="/" />}
					/>
				</Routes>
			</BoardProvider>
		</BrowserRouter>
	)
}

export default App
