import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css' // O el archivo de estilos globales que manejes
import { registerSW } from 'virtual:pwa-register'

// Registra el Service Worker de la PWA para manejo de caché sin conexión
registerSW({ immediate: true })

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)