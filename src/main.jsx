import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// 👇 Apne context provider ko sahi path se import karein
import { ShopProvider } from './components/context/ShopContext.jsx' 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 🌟 Pure project ko ShopProvider ke andar band kar diya */}
    <ShopProvider> 
      <App />
    </ShopProvider>
  </React.StrictMode>,
)