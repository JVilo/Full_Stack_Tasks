import { StrictMode } from 'react'
import axios from 'axios'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

axios.defaults.baseURL = 'https://studies.cs.helsinki.fi/restcountries'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
