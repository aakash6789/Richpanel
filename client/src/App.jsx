import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Register from './components/Register.jsx'
import Login from './components/Login.jsx'
import FBPage from './components/FBPage.jsx'
import Disconnect from './components/Disconnect.jsx'
import Facebook from './components/Facebook.jsx'
import {
  RouterProvider,
  NavLink,
  Router,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" >
      <Route
        path=""
        element={
         <Facebook/>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/disconnect" element={<Disconnect/>} />
      <Route path="/connect" element={<FBPage/>} />
      <Route path='/facebook' element={<Facebook/>}/>
    </Route>
  )
);
function App() {


  return (
    <>
<RouterProvider router={router} />
    </>
  )
}

export default App
