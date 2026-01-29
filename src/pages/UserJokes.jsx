import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addUserJoke,
  editUserJoke,
  deleteUserJoke,
  toggleFavorite,
} from "../features/jokes/jokesSlice";

function UserJokes() {
  const dispatch = useDispatch();
  const { userJokes, favorites } = useSelector((state) => state.jokes);
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

  const handleFavorite = (jokeId) => {
    dispatch(toggleFavorite(jokeId));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Jokes</h1>
      <div className="mb-4">
        <textarea
          value={newJoke}
          onChange={(e) => setNewJoke(e.target.value)}
          placeholder="Write a new joke..."
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleAddJoke}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Add Joke
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {userJokes.map((joke) => (
          <div key={joke.id} className="bg-white p-4 rounded shadow">
            {editingId === joke.id ? (
              <div>
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full p-2 border rounded"
                />
                <button
                  onClick={handleSaveEdit}
                  className="mt-2 px-2 py-1 bg-green-500 text-white rounded"
                >
                  Save
                </button>
              </div>
            ) : (
              <p>{joke.text}</p>
            )}
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => handleEdit(joke.id, joke.text)}
                className="px-2 py-1 bg-yellow-500 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(joke.id)}
                className="px-2 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
              <button
                onClick={() => handleFavorite(joke.id)}
                className={`px-2 py-1 rounded ${favorites.includes(joke.id) ? "bg-purple-500 text-white" : "bg-gray-200"}`}
              >
                {favorites.includes(joke.id) ? "Favorited" : "Favorite"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserJokes;
