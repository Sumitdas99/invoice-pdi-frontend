import React, { useState, useEffect } from "react";
import {
  HomeIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { IoIosCall } from "react-icons/io";
import { MdPeopleAlt, MdLocalFireDepartment } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../../features/authSlice";

const Sidebar = ({ sidebarWidth, setSidebarWidth, savedExpandedState }) => {
  const dispatch = useDispatch();
  const location = useLocation(); // Get the current route
  const [isExpanded, setIsExpanded] = useState(savedExpandedState);
  const { user } = useSelector((state) => state.auth);

  // Define routes based on roles
  const roleRoutes = {
    inspector: [
      {
        path: "/inspector",
        label: "Dashboard",
        icon: <HomeIcon className="h-6 w-6" />,
      },
      {
        path: "/inspector/allocated-call",
        label: "Allocated Call",
        icon: <MdPeopleAlt className="h-6 w-6" />,
      },
      {
        path: "/inspector/ongoing-call",
        label: "Ongoing Call",
        icon: <MdLocalFireDepartment className="h-6 w-6" />,
      },
      {
        path: "/inspector/parts-details",
        label: "Parts Details",
        icon: <IoIosCall className="h-6 w-6" />,
      },
    ],
    manager: [
      {
        path: "/manager",
        label: "Dashboard",
        icon: <HomeIcon className="h-6 w-6" />,
      },
      {
        path: "/manager/allocated-calls",
        label: "Allocated Calls",
        icon: <MdPeopleAlt className="h-6 w-6" />,
      },
      {
        path: "/manager/equipment-list",
        label: "Equipment List",
        icon: <MdLocalFireDepartment className="h-6 w-6" />,
      },
      {
        path: "/manager/pdi-call",
        label: "PDI Call",
        icon: <IoIosCall className="h-6 w-6" />,
      },
      {
        path: "/manager/pi-call",
        label: "PI Call",
        icon: <IoIosCall className="h-6 w-6" />,
      },
      {
        path: "/manager/settings",
        label: "Settings",
        icon: <Cog6ToothIcon className="h-6 w-6" />,
      },
    ],
  };

  const handleToggleSidebar = () => {
    setIsExpanded(!isExpanded);
    setSidebarWidth(isExpanded ? 60 : 240);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = sidebarWidth;

    const handleMouseMove = (e) => {
      const newWidth = Math.min(
        Math.max(startWidth + e.clientX - startX, 60),
        240
      );
      setSidebarWidth(newWidth);
      setIsExpanded(newWidth > 120);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleLogout = async () => {
    try {
      await dispatch(clearUser());
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    localStorage.setItem("sidebarExpanded", isExpanded);
  }, [isExpanded]);

  const renderLinks = () => {
    if (!user || !user.role) return null;

    // Combine routes from all roles, resolving aliases, and remove duplicates
    const links = Array.from(
      new Map(
        user.role
          .flatMap(
            (role) => roleRoutes[roleRoutes[role]] || roleRoutes[role] || []
          )
          .map((route) => [route.path, route])
      ).values()
    );

    return links.map(({ path, label, icon }, index) => (
      <Link
        key={index}
        to={path}
        className={`flex px-4  ${
          isExpanded ? "justify-start mr-6  rounded-r-[50px]" : "justify-center"
        } items-center space-x-3 text-gray-300 hover:text-white transition-all duration-300 hover:bg-indigo-700  hover:px-3 py-3 ${
          location.pathname === path ? "bg-indigo-700  text-white" : ""
        }`}
      >
        {icon}
        {isExpanded && (
          <span className="opacity-100 transition-opacity duration-300">
            {label}
          </span>
        )}
      </Link>
    ));
  };

  return (
    <div
      className={`z-50 fixed top-0 left-0 bottom-0 h-screen overflow-hidden bg-gradient-to-b from-blue-800 to-indigo-900 text-white flex flex-col py-4 transition-all duration-300 ease-in-out shadow-lg`}
      style={{ width: sidebarWidth }}
    >
      {/* Sidebar Toggle Button */}
      <button
        onClick={handleToggleSidebar}
        className="absolute top-4 left-3 text-white bg-indigo-700 hover:bg-indigo-600 rounded-md p-2"
      >
        {isExpanded ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {/* Sidebar Navigation */}
      <nav className="mt-16 flex-1 space-y-3">{renderLinks()}</nav>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className={`mt-auto flex items-center space-x-3 py-2  text-white hover:bg-indigo-600 transition-all duration-300 ${
          isExpanded ? "justify-start px-4" : "justify-center px-0"
        }`}
      >
        <ArrowLeftOnRectangleIcon className="h-6 w-6" />
        {isExpanded && (
          <span className="opacity-100 transition-opacity duration-300">
            Logout
          </span>
        )}
      </button>

      {/* Drag Handle */}
      <div
        className="absolute top-0 right-0 h-full w-2 cursor-ew-resize bg-transparent"
        onMouseDown={handleMouseDown}
      ></div>
    </div>
  );
};

export default Sidebar;
