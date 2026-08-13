import { useState } from 'react'
import { Login, Chat } from './components'
import './App.css'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  if (!token) {
    return <Login setToken={setToken} />;
  }

  return <Chat token={token} setToken={setToken} />;
}

export default App
