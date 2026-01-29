import { Link, NavLink } from "react-router-dom";
import logo from "../assets/not-sorry-logo.png";

function Header() {
  const linkStyles = ({ isActive }) =>
    isActive
      ? "text-slate-900 border-b-2 border-purple-500 pb-1 font-bold"
      : "text-slate-400 hover:text-slate-600 transition-colors";

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center z-10">
      <div className="flex items-center justify-between flex-1 mr-56">
        <div className="py-4">
          <img src={logo} width="80px " />
        </div>
        <nav className="ml-8 flex gap-4 text-sm font-medium">
          <NavLink to="/" className={linkStyles}>
            API Jokes
          </NavLink>
          <NavLink to="/my-jokes" className={linkStyles}>
            My Jokes
          </NavLink>
        </nav>
      </div>

      <div className="flex gap-4 items-center">
        <button className="text-xs uppercase font-bold tracking-widest text-slate-400 hover:text-purple-600">
          IT
        </button>
        <button className="text-xs uppercase font-bold tracking-widest text-slate-400 hover:text-purple-600">
          EN
        </button>
        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200"></div>
      </div>
    </header>
  );
}

export default Header;
