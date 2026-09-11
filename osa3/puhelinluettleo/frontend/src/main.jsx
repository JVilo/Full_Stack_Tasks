import ReactDOM from 'react-dom/client'
import axios from 'axios'
import App from './App'
import './style.css'

const persons = axios.get('http://localhost:3001/api/persons').then(response =>{
    const persons = response.data
    console.log(persons)
    ReactDOM.createRoot(document.getElementById('root')).render(<App persons={persons} />)
})
