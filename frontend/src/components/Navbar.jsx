import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { LogIn, LogOut, User, Bus, Palette } from "lucide-react";
import useAuthStore from "../store/useAuthStore";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuth, getProfileInitial, logout } = useAuthStore();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const name = useAuthStore((s) => s.getUserName());

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    navigate("/login");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <nav className="navbar bg-base-100 shadow-lg px-4 lg:px-8 sticky top-0 z-50 border-b border-base-300">
      <div className="navbar-start">
        <Link 
          to="/" 
          className="btn btn-ghost normal-case text-xl lg:text-2xl font-bold gap-2 hover:scale-105 transition-transform"
        >
          {/* <Bus className="w-6 h-6 text-primary" /> */}
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            TrackBus
          </span>
        </Link>
      </div>

      <div className="navbar-end gap-2">
        {isAuth && (
          <Link
            to="/theme"
            className="btn btn-ghost btn-circle hover:bg-primary/10 transition-all"
            title="Theme Settings"
          >
            <Palette className="w-5 h-5 text-primary" />
          </Link>
        )}

        {!isAuth ? (
          <button
            onClick={() => navigate("/login")}
            className="btn btn-primary btn-sm lg:btn-md gap-2 shadow-md hover:shadow-xl transition-all"
          >
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:inline">Login</span>
          </button>
        ) : (
          <div className="dropdown dropdown-end" ref={dropdownRef}>
            <div
              tabIndex={0}
              role="button"
              onClick={() => setOpen(!open)}
              className="btn btn-ghost btn-circle avatar placeholder hover:bg-primary/10 transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-content flex items-center justify-center font-bold shadow-lg ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
                {getProfileInitial()}
              </div>
            </div>

            {open && (
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-[1] w-56 p-2 shadow-2xl border border-base-300 mt-3 animate-in fade-in slide-in-from-top-2 duration-200"
              >
                <li className="menu-title px-4 py-2">
                  <div className="flex items-center gap-2 text-base-content">
                    <User className="w-4 h-4 text-primary" />
                    <span className="font-semibold truncate">{name}</span>
                  </div>
                </li>
                <div className="divider my-1"></div>
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-error hover:bg-error/10 gap-2 font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;