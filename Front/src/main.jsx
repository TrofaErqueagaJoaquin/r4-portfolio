// QUÉ HACE: Punto de arranque: monta la aplicación de React dentro del
// <div id="root"> de index.html y carga los estilos globales.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
