import { useState, useEffect } from 'react'
import Home from './pages/home'
import Login from './pages/login'
import Signup from './pages/signup'

const App = () => {

  const [currentPage, setCurrentPage] = useState(() => {
    // Get the saved page from localStorage, default to 'login' if none exists
    return localStorage.getItem('currentPage') || 'login';
  });

  // Save current page to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('currentPage', currentPage);
  }, [currentPage]);


  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <Login setCurrentPage={setCurrentPage}/>
      case 'signup':
        return <Signup setCurrentPage={setCurrentPage}/>
      case 'home':
        return <Home setCurrentPage={setCurrentPage}/>
      default:
        return <Login setCurrentPage={setCurrentPage}/>
    }
  }


  return (
    <div>
      {renderPage()}
    </div>
  )
}

export default App
