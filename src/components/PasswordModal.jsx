import { useState } from "react";
import { useDispatch } from "react-redux";
import { setAuthenticated } from "../features/jokes/jokesSlice";
import { useNavigate } from "react-router-dom";

export default function PasswordModal({
  isOpen,
  onClose,
  pendingCategory,
  onAuthSuccess,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Set your password here (you can change this to whatever you want)
  const CORRECT_PASSWORD = "areYouSure??";

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Please enter a username");
      return;
    }

    if (password !== CORRECT_PASSWORD) {
      setError("Incorrect password");
      return;
    }

    // Authentication successful
    dispatch(setAuthenticated(true));
    setUsername("");
    setPassword("");
    onClose();
    if (pendingCategory) {
      navigate(`/api-jokes/${pendingCategory.toLowerCase()}`);
    }
    if (onAuthSuccess) {
      onAuthSuccess(pendingCategory);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-2xl font-bold mb-4">Restricted Content</h2>
        <p className="text-gray-600 mb-6">
          This content is restricted. Please enter your credentials to continue.
          Ask the owner of the Website for the Password...
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter password"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Enter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
