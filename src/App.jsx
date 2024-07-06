import { useState, useContext } from 'react';
import { Routes, Route, NavLink, Navigate, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
// import { signOut } from 'firebase/auth';
// import { auth } from './firebase';
import Dashboard from './page/Dashboard';
import Blog from './page/Blog';
import SignUp from './page/SignUp';
import SignIn from './page/SignIn';
import Home from './page/Home';
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoMenu } from "react-icons/io5";
import { ProtectRouteAdmin } from './protectedRoutes/ProtectRoutAdmin';
import { UserPage } from './page/UserPage';
import { ProtectRouteUser } from './protectedRoutes/ProtectRoutUser';



function App() {
  let user = localStorage.getItem('users')
  const [navbarOpen, setNavbarOpen] = useState(false);
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem('users')
    navigate('/signin')
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
            <li className='text-[700] rounded-[20px] border w-[150%] bg-red-400 border-black mt-[85px] h-[50px] flex items-center justify-center text-black bg-blue '>
              <NavLink to="/home">Home</NavLink>
            </li>
            <li className='text-[700] rounded-[20px] border w-[150%] bg-red-400 border-black mt-[85px] h-[50px] flex items-center justify-center text-black bg-blue '>
              <NavLink to="/blog">Blog</NavLink>
            </li>

            {!user && <>
              <li className='text-[700] rounded-[20px] border w-[150%] bg-red-400 border-black mt-[85px] h-[50px] flex items-center justify-center text-black bg-blue '>
                <NavLink to="/signin">Sign In</NavLink>
              </li>
            </>}



            <li className='text-[700] rounded-[20px] border w-[150%] bg-red-400 border-black mt-[85px] h-[50px] flex items-center justify-center text-black bg-blue '>
              <NavLink to="/dashboard">Dashboard</NavLink>
            </li>
            <li className='text-[700] rounded-[20px] border w-[150%] bg-red-400 border-black mt-[85px] h-[50px] flex items-center justify-center text-black bg-blue '>
              <NavLink to="/userpage">UserPage</NavLink>
            </li>
            {user && <li className='text-[700] rounded-[20px] border w-[150%] bg-red-400 border-black mt-[85px] h-[50px] flex items-center justify-center text-black bg-blue ' onClick={handleSignOut}>
              <Link>Sign Out</Link>
            </li>}
            {/* <li className='text-[700] rounded-[20px] border w-[150%] bg-red-400 border-black mt-[85px] h-[50px] flex items-center justify-center text-black bg-blue '>
              <NavLink to="/signup">signup</NavLink>
            </li> */}
          </ul>
        </nav>
      </div>

      <Routes>
        <Route element={<Blog />} path='/blog' />
        <Route element={<SignUp />} path='/signup' />
        <Route element={<SignIn />} path='/signin' />
        <Route element={<SignUp />} path='/signup' />
        <Route element={<ProtectRouteUser><UserPage /></ProtectRouteUser>} path='/userpage' />

        <Route element={<ProtectRouteAdmin><Dashboard /></ProtectRouteAdmin>} path='/dashboard' />
        <Route element={<Home />} path='/home' />
        <Route element={<Home />} path='/' />
      </Routes>
    </>
  );
}

export default App;
