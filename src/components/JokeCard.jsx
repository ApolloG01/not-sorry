import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleFavorite,
  deleteUserJoke,
  editUserJoke,
} from "../features/jokes/jokesSlice";
import { Star, Trash2, SquarePen } from "lucide-react";

export default function JokeCard({ joke, isUserJoke }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(
    joke.joke || joke.setup || joke.text || "",
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [toast, setToast] = useState(null);
  const dispatch = useDispatch();
  const { favorites } = useSelector((state) => state.jokes);

  const isFavorited = favorites.includes(joke.id);

  const handleFavorite = () => {
    dispatch(toggleFavorite(joke.id));
    setToast(isFavorited ? "Removed from favorites" : "Added to favorites");
    setTimeout(() => setToast(null), 1800);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    dispatch(deleteUserJoke(joke.id));
    setShowDeleteConfirm(false);
    setToast("Joke deleted");
    setTimeout(() => setToast(null), 1800);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleEditChange = (e) => {
    setEditValue(e.target.value);
  };

  const handleEditSave = () => {
    // Save the edited joke
    dispatch(editUserJoke({ id: joke.id, joke: editValue }));
    setIsEditing(false);
    setToast("Joke saved");
    setTimeout(() => setToast(null), 1800);
  };

  const handleEditCancel = () => {
    setEditValue(joke.joke || joke.setup || joke.text || "");
    setIsEditing(false);
  };

  return (
    <div className="relative bg-white border border-slate-300 rounded-4xl shadow p-4 flex flex-col min-h-40 transition-transform hover:-translate-y-1 hover:shadow-lg ">
      {/* Toast notification */}
      {toast && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-black/90 text-white px-4 py-2 rounded shadow-lg z-20 text-sm animate-fade-in">
          {toast}
        </div>
      )}
      {isEditing ? (
        <div className="mb-2 flex flex-col gap-2">
          <textarea
            className="w-full border border-slate-300 rounded-md p-2 text-base font-medium text-slate-900"
            value={editValue}
            onChange={handleEditChange}
            rows={3}
            autoFocus
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={handleEditSave}
              className="px-3 py-1 rounded bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
            >
              Save
            </button>
            <button
              onClick={handleEditCancel}
              className="px-3 py-1 rounded bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : joke.joke ? (
        <p className="mb-2 text-base font-medium text-slate-900">{joke.joke}</p>
      ) : joke.setup ? (
        <div className="mb-2">
          <p className="text-slate-700">{joke.setup}</p>
          <br />
          <p className="font-semibold text-slate-900 mt-2">{joke.delivery}</p>
        </div>
      ) : (
        <p className="mb-2 text-base font-medium text-slate-900">{joke.text}</p>
      )}
      <div className="flex justify-between w-full gap-2 mt-4">
        <div className="space-x-4">
          {isUserJoke && !isEditing && (
            <>
              <button
                onClick={handleEdit}
                className="rounded-md p-2 border border-slate-300 bg-slate-50 text-slate-500 hover:bg-orange-50 hover:text-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-200"
                aria-label="Edit joke"
              >
                <SquarePen size={20} strokeWidth={2} />
              </button>

              <button
                onClick={handleDelete}
                className="rounded-md p-2 border border-slate-300 bg-slate-50 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-200"
                aria-label="Delete joke"
              >
                <Trash2 size={20} strokeWidth={2} />
              </button>

              {/* Delete confirmation dialog */}
              {showDeleteConfirm && (
                <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40">
                  <div className="bg-white rounded-xl shadow-lg p-6 max-w-xs w-full text-center">
                    <p className="mb-4 text-slate-800 font-semibold">
                      Are you sure you want to delete this joke?
                    </p>
                    <div className="flex gap-4 justify-center">
                      <button
                        onClick={confirmDelete}
                        className="px-4 py-1 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                      <button
                        onClick={cancelDelete}
                        className="px-4 py-1 rounded bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <div>
          <button
            onClick={handleFavorite}
            aria-label={isFavorited ? "Unfavorite" : "Favorite"}
            className={`rounded-md p-2 border ${
              isFavorited
                ? "bg-purple-600 text-white border-purple-600 hover:bg-purple-700"
                : "bg-slate-50 text-purple-600 border-slate-300 hover:bg-purple-50"
            } transition-colors focus:outline-none focus:ring-2 focus:ring-purple-200`}
          >
            <Star
              size={20}
              fill={isFavorited ? "#000" : "none"}
              strokeWidth={2}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
