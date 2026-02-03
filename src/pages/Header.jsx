import { NavLink } from "react-router-dom";
import logo from "../assets/not-sorry-logo.png";

function Header() {
  const linkStyles = ({ isActive }) =>
    isActive
      ? "text-purple-600 font-bold"
      : "text-slate-400 hover:text-slate-600 transition-colors";

  return (
    <header className="h-20 bg-white/95 border-b border-slate-200 px-10 flex items-center z-20 shadow-sm">
      <div className="flex items-center justify-between flex-1">
        <div className="py-2 flex items-center gap-3">
          <img src={logo} alt="Not Sorry Logo" className="h-48 w-auto" />
        </div>
        <nav className="ml-8 flex gap-8 text-base font-medium">
          <NavLink to="/" className={linkStyles}>
            API Jokes
          </NavLink>
          <NavLink to="/my-jokes" className={linkStyles}>
            My Jokes
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Header;
