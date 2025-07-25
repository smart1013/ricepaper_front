import { useState } from 'react'
import Home from './pages/home'
import Login from './pages/login'
import Signup from './pages/signup'

const App = () => {

  const [currentPage, setCurrentPage] = useState('login')


  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <Login setCurrentPage={setCurrentPage}/>
      case 'signup':
        return <Signup setCurrentPage={setCurrentPage}/>
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
