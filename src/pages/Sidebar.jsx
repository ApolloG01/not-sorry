import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleShowDirty } from "../features/jokes/jokesSlice";
import { useState } from "react";
import PasswordModal from "../components/PasswordModal";

function Sidebar() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.jokes);
  const [showModal, setShowModal] = useState(false);
  const [pendingCategory, setPendingCategory] = useState(null);

  const getNavStyles = ({ isActive }) =>
    `px-4 py-3 rounded-lg transition-all duration-300 ${
      isActive
        ? "bg-purple-600  text-white shadow-lg shadow-purple-500/20"
        : "text-slate-400 hover:text-white hover:bg-white/5"
    }`;

  const handleRestrictedClick = (category) => {
    if (!isAuthenticated) {
      setPendingCategory(category);
      setShowModal(true);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setPendingCategory(null);
  };

  return (
    <>
      <div className="bg-[#0a0a0a] text-white w-64 h-full flex flex-col p-4 border-r border-white/5">
        <h2 className="text-xl font-bold text-slate-500 uppercase tracking-widest mb-6 px-4">
          CATEGORIES
        </h2>

        <nav className="flex flex-col gap-2">
          <NavLink to="/api-jokes/programming" className={getNavStyles}>
            Programming
          </NavLink>
          <NavLink to="/api-jokes/misc" className={getNavStyles}>
            Misc
          </NavLink>
          <NavLink
            to="/api-jokes/dark"
            className={getNavStyles}
            onClick={() => handleRestrictedClick("dark")}
          >
            Dark
          </NavLink>
          <NavLink to="/api-jokes/pun" className={getNavStyles}>
            Pun
          </NavLink>
          <NavLink
            to="/api-jokes/explicit" 
            className={getNavStyles}
            onClick={() => handleRestrictedClick("explicit")}
          >
            Explicit
          </NavLink>
        </nav>
      </div>

      <PasswordModal isOpen={showModal} onClose={handleModalClose} />
    </>
  );
}

export default Sidebar;
