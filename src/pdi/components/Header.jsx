import { useState, useRef, useEffect } from "react";
import { Sun, Moon, Monitor, User } from "lucide-react"; // Add User icon
import { useSelector, useDispatch } from "react-redux"; // Use dispatch for logout
import { motion } from "framer-motion"; // Import Framer Motion

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false); // Profile dropdown state
  const [themeMode, setThemeMode] = useState("light");
  const { user } = useSelector((state) => state.auth); // Assuming user data is in the auth state

  const dispatch = useDispatch();
  const contentRef = useRef();
  const toggleButtonRef = useRef();
  const profileButtonRef = useRef(); // Ref for profile button

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen((prev) => !prev);
  };

  const changeThemeMode = (mode) => {
    setThemeMode(mode);
    document.documentElement.classList.remove("light", "dark");
    if (mode !== "system") {
      document.documentElement.classList.add(mode);
    }
  };

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" }); // Example dispatch action for logging out
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
        setProfileDropdownOpen(false); // Close profile dropdown if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="p-2 px-4 bg-white shadow-md flex justify-between items-center dark:bg-gray-900 transition-colors duration-300">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search"
        className="w-full max-w-xs p-2  py-1 outline-none rounded-lg border border-gray-300 shadow-sm focus:ring-1 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-yellow-400"
      />
      <div className="flex justify-center items-center">
        {/* Theme Dropdown */}
        <div className="relative">
          <button
            ref={toggleButtonRef}
            onClick={toggleDropdown}
            className="text-2xl p-2 rounded-full focus:outline-none transition-transform transform hover:scale-110 dark:text-white text-gray-800"
            title="Toggle Theme"
          >
            {themeMode === "dark" ? (
              <Moon className="text-blue-500" />
            ) : themeMode === "light" ? (
              <Sun className="text-blue-500" />
            ) : (
              <Monitor className="text-blue-500" />
            )}
          </button>

          {/* Theme dropdown with animation */}
          {dropdownOpen && (
            <motion.div
              ref={contentRef}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute right-0 mt-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-2 w-40 border dark:border-gray-700"
            >
              <button
                onClick={() => changeThemeMode("light")}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  themeMode === "light"
                    ? "text-blue-500"
                    : "text-gray-700 dark:text-gray-200"
                }`}
              >
                <Sun className="w-5 h-5" />
                Light
              </button>
              <button
                onClick={() => changeThemeMode("dark")}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  themeMode === "dark"
                    ? "text-blue-500"
                    : "text-gray-700 dark:text-gray-200"
                }`}
              >
                <Moon className="w-5 h-5" />
                Dark
              </button>
              <button
                onClick={() => changeThemeMode("system")}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  themeMode === "system"
                    ? "text-blue-500"
                    : "text-gray-700 dark:text-gray-200"
                }`}
              >
                <Monitor className="w-5 h-5" />
                System
              </button>
            </motion.div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            ref={profileButtonRef}
            onClick={toggleProfileDropdown}
            className="text-2xl p-2 rounded-full focus:outline-none transition-transform transform hover:scale-110 dark:text-white text-gray-800"
            title="User Profile"
          >
            <User />
          </button>

          {/* Profile dropdown with animation */}
          {profileDropdownOpen && (
            <motion.div
              ref={contentRef}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute right-0 mt-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-2 w-40 border dark:border-gray-700"
            >
              <div className=" py-1 text-sm font-medium text-gray-700 dark:text-gray-200 overflow-hidden">
                <p className="flex items-center px-2">
                  {user.role.includes("inspector") ? "inspector" : "manager"}
                  <span className="text-xs"> ({user?.fullName})</span>
                </p>{" "}
                {/* Display user name */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-2  py-2 text-sm font-medium w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-red-500"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
