import "./App.css";
import MapModel from "./components/MapModel";
import { ThemeProvider } from "@mui/material/styles";
import { customTheme } from "./theme.js"; 

function App() {
	return (
		<ThemeProvider theme={customTheme}>
			<div className="App">
				<MapModel />
			</div>
		</ThemeProvider>
	);
}

export default App;
