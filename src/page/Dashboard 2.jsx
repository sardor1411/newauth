import React, { useState, useEffect } from 'react';
import 'boxicons/css/boxicons.min.css';

const DashboardTwo = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div>
      <nav className={`sidebar fixed top-0 left-0 h-full w-64 bg-white transition-all duration-300 z-50 mt-[100px] ${darkMode ? 'dark:bg-gray-800' : 'bg-white'}`}>

        <header className="flex items-center p-4">
          <div className="flex items-center space-x-4">
            <img
              src="https://i.postimg.cc/jqgkqhSb/cast-11.jpg"
              alt="image gallery"
              className="w-12 h-12 rounded-full"
            />
            <div className="flex flex-col">
              <span className="text-lg font-semibold">ICOM DIGITAL</span>
              <span className="text-sm">Development</span>
            </div>
          </div>
          <i className="bx bx-chevron-right toggle ml-auto cursor-pointer"></i>
        </header>

        <div className="menu-bar flex flex-col justify-between overflow-y-auto">
          <div className="menu px-4">
            <li className="search-box bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center p-2">
              <i className="bx bx-search icon"></i>
              <input
                type="text"
                placeholder="Search..."
                className="ml-4 bg-transparent outline-none w-full text-gray-600 dark:text-gray-300"
              />
            </li>

            <ul className="menu-links mt-6 space-y-2">
              <li className="nav-link">
                <a
                  href="#"
                  className="flex items-center p-2 rounded-lg hover:bg-red-500 hover:text-white"
                >
                  <i className="bx bx-home-alt icon"></i>
                  <span className="ml-4">Dashboard</span>
                </a>
              </li>

              <li className="nav-link">
                <a
                  href="#"
                  className="flex items-center p-2 rounded-lg hover:bg-red-500 hover:text-white"
                >
                  <i className="bx bx-bar-chart-alt-2 icon"></i>
                  <span className="ml-4">Revenue</span>
                </a>
              </li>

              <li className="nav-link">
                <a
                  href="#"
                  className="flex items-center p-2 rounded-lg hover:bg-red-500 hover:text-white"
                >
                  <i className="bx bx-bell icon"></i>
                  <span className="ml-4">Notifications</span>
                </a>
              </li>

              <li className="nav-link">
                <a
                  href="#"
                  className="flex items-center p-2 rounded-lg hover:bg-red-500 hover:text-white"
                >
                  <i className="bx bx-pie-chart-alt icon"></i>
                  <span className="ml-4">Analytics</span>
                </a>
              </li>

              <li className="nav-link">
                <a
                  href="#"
                  className="flex items-center p-2 rounded-lg hover:bg-red-500 hover:text-white"
                >
                  <i className="bx bx-heart icon"></i>
                  <span className="ml-4">Likes</span>
                </a>
              </li>

              <li className="nav-link">
                <a
                  href="#"
                  className="flex items-center p-2 rounded-lg hover:bg-red-500 hover:text-white"
                >
                  <i className="bx bx-wallet icon"></i>
                  <span className="ml-4">Wallets</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="bottom-content px-4 py-4">
            <li>
              <a
                href="#"
                className="flex items-center p-2 rounded-lg hover:bg-red-500 hover:text-white"
              >
                <i className="bx bx-log-out icon"></i>
                <span className="ml-4">Logout</span>
              </a>
            </li>

            {/* Dark Mode Toggle */}
            <li
              className="mode mt-4 flex items-center justify-between bg-gray-200 dark:bg-gray-700 p-2 rounded-lg cursor-pointer"
              onClick={toggleDarkMode}
            >
              <div className="flex items-center space-x-4">
                {darkMode ? (
                  <>
                    <i className="bx bx-sun icon"></i>
                    <span className="text-sm text-white">Light mode</span>
                  </>
                ) : (
                  <>
                    <i className="bx bx-moon icon"></i>
                    <span className="text-sm text-black">Dark mode</span>
                  </>
                )}
              </div>
              <div className="toggle-switch relative w-10 h-5 bg-gray-300 dark:bg-gray-600 rounded-full">
                <span
                  className={`switch absolute top-1 left-1 w-3.5 h-3.5 bg-white rounded-full transition-transform ${darkMode ? 'transform translate-x-5' : ''}`}
                ></span>
              </div>
            </li>
          </div>
        </div>
      </nav>

      <section className="home flex-1 ml-64 p-6 bg-slate-100 dark:bg-gray-900 transition duration-300">
        <div className="text-3xl font-semibold">Dashboard Sidebar</div>
      </section>
    </div>
  );
};

export default DashboardTwo;
