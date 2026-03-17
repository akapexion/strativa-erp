import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = ({ userLogged }) => {
  useEffect(() => {
    console.log(userLogged);
  }, []);
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12 py-4">
        {/* Logo / ERP Name */}
        <Link to="/" className="group flex items-center gap-2">
          <div>
            <img src="./strativa.png" width={150} alt="" />
          </div>
        </Link>

        {/* Portal Button */}
        <div className="flex items-center gap-6">
          <Link
            to={
              !userLogged
                ? "/login"
                : userLogged.user_role === 0
                  ? "/hr360/admin"
                  : "/hr360/user"
            }
            className="relative inline-flex items-center justify-center px-8 py-2.5 overflow-hidden font-semibold text-blue-600 transition duration-300 ease-out border-2 border-blue-600 rounded-full shadow-md group"
          >
            <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-blue-600 group-hover:translate-x-0 ease">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                ></path>
              </svg>
            </span>
            <span className="absolute flex items-center justify-center w-full h-full text-blue-600 transition-all duration-300 transform group-hover:translate-x-full ease">
              Sign In
            </span>
            <span className="relative invisible">Sign In</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
