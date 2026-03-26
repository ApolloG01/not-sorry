import { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../services/supabase.js";
import { setAuthenticated } from "../features/jokes/jokesSlice.js";
import { useAppDispatch } from "../store.js";
import type { PasswordModalI } from "../types/types.js";

export default function PasswordModal({
  isOpen,
  onClose,
  pendingCategory,
  onAuthSuccess,
}: PasswordModalI) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Note: Supabase uses Email for signInWithPassword by default
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // 1. Talk to Supabase
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // 2. If successful, update Redux
    dispatch(setAuthenticated(true));

    // 3. Handle navigation logic
    if (pendingCategory) {
      navigate(`/api-jokes/${pendingCategory.toLowerCase()}`);
      if (onAuthSuccess) {
        onAuthSuccess(pendingCategory);
      }
    }

    // 4. Cleanup
    setLoading(false);
    setEmail("");
    setPassword("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-2xl font-bold mb-2">Login to Jokes</h2>
        <p className="text-gray-600 mb-6 text-sm">
          Use your Supabase credentials to access restricted joke categories.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <p className="text-red-500 text-xs italic">{error}</p>}

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
              disabled={loading}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:bg-purple-300"
            >
              {loading ? "Verifying..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
