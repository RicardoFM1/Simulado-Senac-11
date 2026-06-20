
import './App.css'
import { BrowserRouter, Route, Routes } from "react-router"
import { ToastContainer } from "react-toastify"
import Home from './pages/Home/home'
import Login from './pages/Login/login'
function App() {


  return (
    <>
      <ToastContainer position='top-right' autoClose={3000} />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
