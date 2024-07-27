import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from './context/AuthContext';
import SignUp from './page/SignUp';
import SignIn from './page/SignIn';

import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoMenu } from "react-icons/io5";
import { ProtectRouteAdmin } from './protectedRoutes/ProtectRoutAdmin';
import { ProtectRouteUser } from './protectedRoutes/ProtectRoutUser';
import TapBot from './page/TapBot';

function App() {
  let user = localStorage.getItem('users');
  const [navbarOpen, setNavbarOpen] = useState(false);
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem('users');
    navigate('/signin');
  };

  const toggleNavbar = () => {
    setNavbarOpen(!navbarOpen);
  };

  const menuToggle = () => {
    const menu = document.getElementById("menu");
    const liElements = document.querySelectorAll("#ulMenu li");

    menu.classList.toggle("h-[200px]");
    liElements.forEach((li) => {
      if (li.style.display === "none") {
        li.style.display = "block";
      } else {
        li.style.display = "none";
      }
    });
  };

  const menuResize = () => {
    const window_size = window.innerWidth || document.body.clientWidth;
    const menu = document.getElementById("menu");
    const liElements = document.querySelectorAll("#ulMenu li");

    if (window_size > 1000) {
      menu.classList.remove("h-32");
      liElements.forEach((li) => {
        li.style.display = "none";
      });
    } else {
      liElements.forEach((li) => {
        li.style.display = "none";
      });
    }
  };

  useEffect(() => {
    window.addEventListener("resize", menuResize);
    menuResize();
    return () => {
      window.removeEventListener("resize", menuResize);
    };
  }, []);

  return (
    <>
      <nav id="nav" className="bg-blue-700 shadow" role="navigation">
        <div className="container mx-auto p-4 flex flex-wrap items-center md:flex-no-wrap">
          <div className="mr-4 md:mr-8">
            <a href="#" rel="home">
              <span className="text-xl text-white">NavBar</span>
            </a>
          </div>
          <div className="ml-auto md:hidden">
            <button onClick={menuToggle} className="flex items-center px-3 py-2 border rounded" type="button">
              <svg className="h-3 w-3 text-white" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <title>Menu</title>
                <path fill="currentColor" d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
              </svg>
            </button>
          </div>
          <div id="menu" className="w-full h-0 transition-all ease-out duration-500 md:transition-none md:w-auto md:flex-grow md:flex md:items-center">
            <ul id="ulMenu" className="grid grid-cols-4 mt-[20px] md:flex md:flex-row md:gap-4 md:ml-0 md:pt-0 md:border-0">
              <li className="col-span-2 md:col-auto">
                <Link className="md:p-2 lg:px-4 font-semibold block text-white px-4 py-1" to="/home">Home</Link>
              </li>
              <li className="col-span-2 md:col-auto">
                <Link className="md:p-2 lg:px-4 font-semibold block text-white px-4 py-1" to="/blog">Blog</Link>
              </li>
              <li className="col-span-2 md:col-auto">
                <Link className="md:p-2 lg:px-4 font-semibold block text-white px-4 py-1" to="/signin">Sign IN</Link>
              </li>
              <li className="col-span-2 md:col-auto">
                <Link className="md:p-2 lg:px-4 font-semibold block text-white px-4 py-1" to="/dashboard">Dashboard</Link>
              </li>
              <li className="col-span-2 md:col-auto">
                <Link className="md:p-2 lg:px-4 font-semibold block text-white px-4 py-1" to="/bekzod">Bekzod</Link>
              </li>
              <li className="col-span-2 md:col-auto">
                <Link className="md:p-2 lg:px-4 font-semibold block text-white px-4 py-1" to="/userpage">User Page</Link>
              </li>
              {user && (
                <li className="col-span-2 md:col-auto" onClick={handleSignOut}>
                  <Link className="md:p-2 lg:px-4 font-semibold block text-white px-4 py-1">Sign Out</Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <div className='w-full border'>
        <nav className='flex w-[80%] m-auto justify-evenly gap-2 h-[50px] items-center'>
          <button className='border w-[10%] h-[85%] flex items-center justify-center text-black text-bold bg-blue text-[30px]' onClick={toggleNavbar}>
            <IoMenu />
          </button>
        </nav>
      </div>

      <div className={`nav w-[31%] backdrop-blur-[100px] h-[100%] fixed top-[0px] border   ${navbarOpen ? 'right-[1]' : 'fixed right-[200%]'}`}>
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
              <NavLink to="/bekzod">Bekzod</NavLink>
            </li>
            <li className='text-[700] rounded-[20px] border w-[150%] bg-red-400 border-black mt-[85px] h-[50px] flex items-center justify-center text-black bg-blue '>
              <NavLink to="/userpage">User Page</NavLink>
            </li>
            {user && <li className='text-[700] rounded-[20px] border w-[150%] bg-red-400 border-black mt-[85px] h-[50px] flex items-center justify-center text-black bg-blue '>
              <NavLink to="/signin" onClick={handleSignOut}>Sign Out</NavLink>
            </li>}
          </ul>
        </nav>
      </div>

      <Routes>
        <Route path="/tapbot" element={<TapBot />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/userpage" element={<ProtectRouteAdmin><TapBot /></ProtectRouteAdmin>} />
        <Route path="/search" element={<Search />} />
        <Route path="/tapbot" element={<ProtectRouteUser><TapBot /></ProtectRouteUser>} />
      </Routes>
    </>
  );
}

export default App;
