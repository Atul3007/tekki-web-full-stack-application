import './App.css';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import CreateMenu from './pages/CreateMenu';
import ViewMenu from './pages/ViewMenu';

function App() {
  return (
   <>
    <BrowserRouter>
          <Routes>
            <Route path="/" element={<CreateMenu />}></Route>
            <Route path="/view" element={<ViewMenu/>}></Route>
            </Routes>
    </BrowserRouter>
   </>
  );
}

export default App;
