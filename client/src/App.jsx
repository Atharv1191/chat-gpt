import React, { useState } from 'react'
import Sidebar from './componants/Sidebar'
import { Route, Routes, useLocation } from 'react-router-dom'
import ChatBox from './componants/ChatBox'
import Credits from './pages/Credits'
import Comunity from './pages/Comunity'
import { assets } from './assets/assets'
import './assets/prism.css'
import Loading from './pages/Loading'
import { useAppContect } from './context/AppContext'
import Login from './pages/Login'
import {Toaster} from 'react-hot-toast'
const App = () => {
  const {user,loadingUser} = useAppContect()
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {pathname} =useLocation()
  if(pathname === '/loading'|| loadingUser) return <Loading/>
  return (
    <>
    <Toaster/>
    {!isMenuOpen && <img className='absolute top-3 w-8 h-8 cursor-pointer md:hidden not-dark:invert'onClick={()=>setIsMenuOpen(true)} src={assets.menu_icon}/>}
    {user ? (
       <div className='dark:bg-gradient-to-b from-[#242124] to-[#000000] dark:text-white'>
       <div className='flex h-screen w-screen'>
      <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen}/>
      <Routes>
        <Route path='/' element={<ChatBox/>}/>
        <Route path='/credits' element={<Credits/>}/>
        <Route path='/community' element={<Comunity/>}/>
      </Routes>
    </div>
    </div>
    ):(
      <div className='bg-gradient-to-b from-[#242124] to-[#000000] flex items-center justify-center h-screen w-screen'>
        <Login/>
      </div>
    )
    }
   
   

    </>
  )
}

export default App