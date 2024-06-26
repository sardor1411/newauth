import { useState, useContext } from 'react';
import { Routes, Route, NavLink, Navigate, Link } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from './firebase'; 
import Dashboard from './page/Dashboard';
import Blog from './page/Blog';
import SignUp from './page/SignUp';
import SignIn from './page/SignIn';
import Home from './page/Home';
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoMenu } from "react-icons/io5";




function App() {
  const { currentUser } = useContext(AuthContext);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const { dispatch } = useContext(AuthContext);


  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to='/signin' />;
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        dispatch({ type: "LOGIN", payload: null });
      })
      .catch((error) => {
        console.error('hechnma', error);
      });
  };

  const toggleNavbar = () => {
    setNavbarOpen(!navbarOpen);
  };

  return (
    <>
      <div className='w-full border'>
        <nav className='flex w-[80%] m-auto justify-evenly gap-2 h-[50px] items-center'>
          <button className='border w-[10%] h-[85%] flex items-center justify-center text-black text-bold bg-blue text-[30px]' onClick={toggleNavbar}>
            <IoMenu />
          </button>
        </nav>
      </div>

      <div className={`nav w-[31%] backdrop-blur-[10px] h-[100%] fixed top-[0px] border ${navbarOpen ? 'block' : 'hidden'}`}>
        <nav>
          <button className='text-[35px] absolute top-0 left-[80%]' onClick={toggleNavbar}><IoIosCloseCircleOutline /></button>
          <ul className=' w-[80%] m-auto gap-2 h-[50px] grid items-center justify-center'>
            <li className='text-[700] border w-[150px] bg-red-400 border-black mt-[85px] h-[50px] flex items-center justify-center text-black bg-blue '>
              <NavLink to="/home">Home</NavLink>
            </li>
            <li className='text-[700] border w-[150px] bg-red-400 border-black mt-[85px] h-[50px] flex items-center justify-center text-black bg-blue '>
              <NavLink to="/blog">Blog</NavLink>
            </li>
            {!currentUser && (
              <>
                <li className='text-[700] border w-[150px] bg-red-400 border-black mt-[85px] h-[50px] flex items-center justify-center text-black bg-blue '>
                  <NavLink to="/signup">Sign Up</NavLink>
                </li>
                <li className='text-[700] border w-[150px] bg-red-400 border-black mt-[85px] h-[50px] flex items-center justify-center text-black bg-blue '>
                  <NavLink to="/signin">Sign In</NavLink>
                </li>
              </>
            )}
            {currentUser && (
              <li className='text-[700] border w-[150px] bg-red-400 border-black mt-[85px] h-[50px] flex items-center justify-center text-black bg-blue ' onClick={handleSignOut}>
                <Link>Sign Out</Link>
              </li>
            )}
            <li className='text-[700] border w-[150px] bg-red-400 border-black mt-[85px] h-[50px] flex items-center justify-center text-black bg-blue '>
              <NavLink to="/dashboard">Dashboard</NavLink>
            </li>
          </ul>
        </nav>
      </div>

      <Routes>
        <Route element={<Blog />} path='/blog' />
        <Route element={<SignUp />} path='/signup' />
        <Route element={<SignIn />} path='/signin' />
        <Route element={<RequireAuth><Dashboard /></RequireAuth>} path='/dashboard' />
        <Route element={<Home />} path='/home' />
        <Route element={<Home />} path='/' />
      </Routes>
    </>
  );
}

export default App;
