import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addUserJoke,
  editUserJoke,
  deleteUserJoke,
} from "../features/jokes/jokesSlice";
import JokeCard from "../components/JokeCard";

function UserJokes() {
  const dispatch = useDispatch();
  const { userJokes } = useSelector((state) => state.jokes);
  const [newJoke, setNewJoke] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const handleAddJoke = () => {
    if (newJoke.trim()) {
      dispatch(addUserJoke({ text: newJoke, category: "user" }));
      setNewJoke("");
    }
  };

  const handleEdit = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const handleSaveEdit = () => {
    dispatch(editUserJoke({ id: editingId, text: editText }));
    setEditingId(null);
    setEditText("");
  };

  const handleDelete = (id) => {
    dispatch(deleteUserJoke(id));
  };

  return (
    <div className="px-2 md:px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          My Jokes
        </h1>
      </div>
      <div className="mb-8">
        <textarea
          value={newJoke}
          onChange={(e) => setNewJoke(e.target.value)}
          placeholder="Write a new joke..."
          className="w-full p-3 rounded-xl border border-slate-200 bg-white/60 focus:ring-2 focus:ring-purple-200 focus:outline-none transition"
          rows={2}
        />

        {/* Create button */}
        <div className="mt-auto">
          <button
            onClick={handleAddJoke}
            className="px-4 py-3 my-6 bg-purple-500 text-white rounded-xl font-bold shadow-lg shadow-purple-200 hover:bg-purple-700 transition-all active:scale-95 flex justify-center mx-auto"
          >
            + Create New Joke
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {userJokes.map((joke) =>
          editingId === joke.id ? (
            <div
              key={joke.id}
              className="relative bg-white/70 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg p-5 flex flex-col min-h-[140px]"
            >
              <div className="absolute left-0 top-4 bottom-4 w-1 rounded bg-purple-400/80" />
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 bg-white/80 focus:ring-2 focus:ring-purple-200 focus:outline-none transition mb-2"
                rows={2}
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-1 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 transition"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="px-4 py-1 rounded-xl bg-slate-200 text-slate-600 font-semibold hover:bg-slate-300 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <JokeCard
              key={joke.id}
              joke={joke}
              isUserJoke={true}
              editable
              onEdit={() => handleEdit(joke.id, joke.text)}
              onDelete={() => handleDelete(joke.id)}
            />
          ),
        )}
      </div>
    </div>
  );
}

export default UserJokes;
