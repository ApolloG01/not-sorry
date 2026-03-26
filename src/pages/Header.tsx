import logo from "../assets/not-sorry-logo.png";
import { useAppDispatch, useAppSelector } from "../store";
import supabase from "../services/supabase";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { setAuth } from "../features/jokes/jokesSlice";

function Header() {
  const { isAuthenticated } = useAppSelector((state) => state.jokes);
  const navigate = useNavigate();

  // Reusable style for all nav items
  const linkStyles = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "text-purple-600 font-bold"
      : "text-slate-400 hover:text-slate-600 transition-colors";

  // Style for the Logout button
  const buttonStyles =
    "text-slate-400 hover:text-red-500 transition-colors font-medium";

  const dispatch = useAppDispatch();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      dispatch(setAuth(false));
      navigate("/login");
    }
  };

  return (
    <header className="h-20 bg-white/95 border-b border-slate-200 px-10 flex items-center z-20 shadow-sm">
      <div className="flex items-center justify-between flex-1">
        {/* Logo Section */}
        <Link to="/" className="py-2 flex items-center gap-3">
          <img
            src={logo}
            alt="Not Sorry Logo"
            className="h-48 w-auto object-contain"
          />
        </Link>

        {/* Unified Navigation Section */}
        <nav className="flex items-center gap-8 text-base font-medium">
          <NavLink to="/" className={linkStyles}>
            API Jokes
          </NavLink>

          <NavLink to="/my-jokes" className={linkStyles}>
            My Jokes
          </NavLink>

          <NavLink to="/favorites" className={linkStyles}>
            Favorites
          </NavLink>

          {isAuthenticated ? (
            <button onClick={handleSignOut} className={buttonStyles}>
              Logout
            </button>
          ) : (
            <NavLink to="/login" className={linkStyles}>
              Login
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
