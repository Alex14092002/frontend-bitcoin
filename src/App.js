import logo from "./logo.svg";
import TradingView from "./Components/TradingView";
import Home from "./Components/Home";
import Signin from "./Components/Signin";
import Signup from "./Components/Signup";
import { Route, Routes } from "react-router-dom";

function App() {
	return (
		<>
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/login' element={<Signin />} />
				<Route path='/signup' element={<Signup />} />
			</Routes>
		</>
	);
}

export default App;
