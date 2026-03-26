import React, { useState, useEffect } from "react";
import {
  toggleFavorite,
  deleteUserJoke,
  editUserJoke,
} from "../features/jokes/jokesSlice.js";
import { Star, Trash2, SquarePen } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store.js";
import type { JokeCardPropsI } from "../types/types.js";
import supabase from "../services/supabase.ts";

export default function JokeCard({ joke, isUserJoke }: JokeCardPropsI) {
  const dispatch = useAppDispatch();
  const { favorites, isAuthenticated } = useAppSelector((state) => state.jokes);

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Determine what text to show safely
  const jokeText = joke.text || joke.joke || "";
  const hasTwoParts = !!joke.setup;

  useEffect(() => {
    setEditValue(jokeText || joke.setup || "");
  }, [joke, jokeText]);

  const targetId = String(joke.id ?? joke.joke_id ?? "");

  const isFavorited = favorites.some((fav) => {
    const favId = String(fav.id ?? fav.joke_id ?? "");
    return favId === targetId && targetId !== "";
  });

  const handleFavorite = async () => {
    if (!isAuthenticated) return;

    if (isFavorited) {
      // --- REMOVE LOGIC ---
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("joke_id", targetId);

      if (!error) {
        // Tell Redux to remove it from the list
        dispatch(toggleFavorite(joke));
        setToast("Removed from favorites");
      } else {
        console.error("Error removing favorite:", error.message);
      }
    } else {
      // Flatten Data for the Reducer
      const cleanJokeData = {
        ...joke,
        text: jokeText,
        category: isUserJoke ? "user" : joke.category || "general",
        isUserJoke: isUserJoke,
      };

      const { error } = await supabase.from("favorites").insert([
        {
          joke_id: targetId,
          category: isUserJoke ? "user" : joke.category || "general",
          joke_data: cleanJokeData,
        },
      ]);

      if (!error) {
        // Tell Redux to add it to the list
        dispatch(toggleFavorite(cleanJokeData));
        setToast("Added to favorites!");
      } else {
        console.error("Error adding favorite:", error.message);
      }
    }
  };

  const handleEditSave = async () => {
    const { error } = await supabase
      .from("jokes")
      .update({ text: editValue })
      .eq("id", targetId);
    if (!error) {
      dispatch(editUserJoke({ id: targetId, text: editValue }));
      setIsEditing(false);
      setToast("Updated!");
    }
  };

  const confirmDelete = async () => {
    // 1. Delete the "Original" from your created jokes
    const { error: jokeError } = await supabase
      .from("jokes")
      .delete()
      .eq("id", targetId);

    // 2. Delete from favorites table too
    const { error: favError } = await supabase
      .from("favorites")
      .delete()
      .eq("joke_id", targetId);

    if (!jokeError && !favError) {
      // 3. Update Redux
      dispatch(deleteUserJoke(targetId));
      setShowDeleteConfirm(false);
      setToast("Joke permanently deleted");
    } else {
      console.error("Delete failed:", jokeError || favError);
    }
  };

  return (
    <div className="relative bg-white border border-slate-300 rounded-3xl shadow p-5 flex flex-col min-h-40 transition-all hover:shadow-md">
      {toast && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-3 py-1 rounded-full z-20 text-xs shadow-lg animate-fade-in">
          {toast}
        </div>
      )}

      <div className="flex-1">
        {isEditing ? (
          <div className="flex flex-col gap-2">
            <textarea
              className="w-full border border-purple-200 rounded-xl p-2 text-sm focus:ring-2 focus:ring-purple-100 outline-none"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              rows={3}
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={handleEditSave}
                className="text-xs font-bold text-purple-600 px-2 py-1"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="text-xs font-bold text-slate-400 px-2 py-1"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="py-2">
            {/* THE MASTER RENDER LOGIC */}
            {jokeText ? (
              <p className="text-slate-900 font-medium leading-relaxed">
                {jokeText}
              </p>
            ) : hasTwoParts ? (
              <div className="space-y-2">
                <p className="text-slate-600 italic">{joke.setup}</p>
                <p className="text-slate-900 font-bold">{joke.delivery}</p>
              </div>
            ) : (
              <p className="text-red-400 italic text-sm">
                Content missing in database.
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-50">
        <div className="flex gap-2">
          {isUserJoke && !isEditing && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-slate-400 hover:text-purple-600 transition-colors"
              >
                <SquarePen size={18} />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </>
          )}
        </div>

        <button
          onClick={handleFavorite}
          className={`p-2 rounded-xl transition-all ${isFavorited ? "text-purple-600 bg-purple-50 shadow-sm" : "text-slate-300 hover:text-purple-300"}`}
        >
          <Star size={22} fill={isFavorited ? "currentColor" : "none"} />
        </button>
      </div>

      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center p-4 text-center z-10 shadow-inner">
          <p className="text-sm font-bold text-slate-800 mb-3">
            Delete permanently?
          </p>
          <div className="flex gap-3">
            <button
              onClick={confirmDelete}
              className="bg-red-500 text-white px-4 py-1 rounded-lg text-xs font-bold hover:bg-red-600"
            >
              Delete
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="bg-slate-200 text-slate-600 px-4 py-1 rounded-lg text-xs font-bold hover:bg-slate-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
