import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import BrowserRouter
import Login from './Pages/Login';
import Home from './Pages/Home';
import Menu from './Pages/Menu';
import CreateItem from './components/Menu/addmenuform';
import EditMenu from './components/Menu/EditMenuStaff';
import Orderreq from './Pages/Orders';



function App() {
  return (
    <div>
   
      <Router>
      <Routes>
        <Route path='/login' element={<Login/>} />
        <Route path='/' element={<Home/>} />
        <Route path='/menu' element={<Menu/>} />
        <Route path='/orders' element={<Orderreq/>} />
        <Route path='/menu/add-menu' element={<CreateItem/>} />
        <Route path='/menu/edit-menu/:id' element={<EditMenu/>} />
        
      </Routes>

      </Router>
    </div>
  );
}

export default App;
