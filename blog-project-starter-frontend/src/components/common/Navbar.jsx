import "./Navbar.css"
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../../config/firebase'

function Navbar() {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(Boolean(user))
    })
  }, [])

  const handleLogout = async () => {
    setAuthError('')

    try {
      await signOut(auth)
      navigate('/login')
    } catch (error) {
      console.error('Failed to log out:', error)
      setAuthError('Could not log out. Please try again.')
    }
  }

  return (
    <>
      <nav className='py-5 flex justify-between items-center'>
        <h2 className='text-2xl font-bold'>Blogie.</h2>
        <div className='flex items-center'>
          <Link className='list-none px-5' to={"/home"}>Home</Link>
          <Link className='list-none px-5' to={"/blogs"}>Blogs</Link>
          <Link className='list-none px-5' to={"/about"}>About</Link>
          {isLoggedIn ? (
            <button className='button-style hidden md:block' onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <button className='button-style hidden md:block' onClick={() => navigate("/login")}>
              Login
            </button>
          )}
        </div>
      </nav>
      {authError && <p role="alert" className="text-red-600">{authError}</p>}
    </>
  )
}

export default Navbar