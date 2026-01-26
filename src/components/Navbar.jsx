import Link from "next/link";
import React, { useState, useEffect, useContext } from "react";
import { useDispatch } from "react-redux";
import themeContext from "./context/themeContext";
import { useRouter } from "next/router";
import { isAuthenticateUser, removeUserInfo } from "@/services/auth.service";

const Navbar = () => {
  const [openBasic, setOpenBasic] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const context = useContext(themeContext);
  const { token } = context;
  const router = useRouter();
  // Check for token in localStorage only on the client-side
  useEffect(() => {
    setIsAuthenticated(isAuthenticateUser());
  }, [isAuthenticated]);
  const dispatch = useDispatch(); // You need to import this if not present, but wait, I need to check imports.
  const handleLogout = () => {
    removeUserInfo();
    // setIsAuthenticated(false); // This usually updates via useEffect but explicit set matches current style
    // However, dispatching Redux logout is key for consistency
    import("@/redux/state/userSlice").then(({ logout }) => {
      dispatch(logout());
    });
    router.push("/"); // Redirect to login page after logout
  };
  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            NAKHLAH
          </span>
        </Link>
        {/* Rest of your component */}
        <div className="hidden w-full md:block md:w-auto" id="navbar-dropdown">
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <Link
                href="/"
                className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500 dark:bg-blue-600 md:dark:bg-transparent"
                aria-current="page"
              >
                Home
              </Link>
            </li>
            {token && (
              <>
                <li>
                  <Link
                    href="/query"
                    className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500 dark:bg-blue-600 md:dark:bg-transparent"
                    aria-current="page"
                  >
                    Query
                  </Link>
                </li>
                <li>
                  <Link
                    href="/learn"
                    className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500 dark:bg-blue-600 md:dark:bg-transparent"
                    aria-current="page"
                  >
                    Learn
                  </Link>
                </li>
              </>
            )}
            {!token && (
              <>
                <li>
                  <Link
                    href="/auth/register"
                    className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:border-gray-700 dark:hover:bg-gray-700 md:dark:hover:bg-transparent"
                  >
                    Register
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:border-gray-700 dark:hover:bg-gray-700 md:dark:hover:bg-transparent"
                  >
                    Sign in
                  </Link>
                </li>
              </>
            )}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:border-gray-700 dark:hover:bg-gray-700 md:dark:hover:bg-transparent"
              >
                Logout
              </button>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
