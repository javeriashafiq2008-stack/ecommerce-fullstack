
import { Outlet } from 'react-router'
import Footer from './components/Footer'
import Navbar from './components/Navbar'

function Root() {

   
    
  return (
    <>
    
     <Navbar/>
    <Outlet/>
    <Footer/>
    
    
    
    
    
    
    
    
    </>
  )
}

export default Root