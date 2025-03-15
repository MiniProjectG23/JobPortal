import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {BrowserRouter, Route,Routes} from 'react-router-dom'
import Login from './components/Auth/Login'
import Navbar from './components/Layout/Navbar'
import Footer from './components/Layout/Footer'
import Home from './components/Home/Home'
const  App = () => {

  return (
    <>
    <BrowserRouter>
    <Navbar/>
    <Routes>
      <Route path = '/login' element = {<Login/>}/>
      <Route path = '/' element = {<Home/>}/>
    </Routes>
    <Footer/>
    </BrowserRouter>
    </>
  )
}

export default App
