import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import BrowserRouter
import Login from './Pages/Login';
import Home from './Pages/Home';
import Staff from './Pages/Staff';



function App() {
  return (
    <Router>
      <Routes>
        <Route path='/login-admin' element={<Login/>} />
        <Route path='/' element={<Home/>} />
        <Route path='/staff' element={<Staff/>} />
        {/* <Route path='/dashboard' element={</>} /> */}
      </Routes>
    </Router>
  );
}

export default App;
