import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [response, setResponse] = useState(null)
  useEffect(() => {
    fetch("http://localhost:5001/hello")
      .then((response) => {
        debugger
        
        
        return response.json()})
      .then((response) => {
        debugger
        
        setResponse(response.response)})
      .catch((error) => console.error(error));
  }, []);
  return (
    <>
      <p>{{response}}</p>
    </>
  )
}

export default App
