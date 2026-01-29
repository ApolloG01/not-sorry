import { Outlet } from "react-router-dom";
import Header from "../pages/Header"; // Adjust path if needed
import Sidebar from "../pages/Sidebar";

function AppLayout() {
  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <Header />

      {/* 2. MAIN CONTAINER - Three columns side by side */}
      <div className="flex flex-1 overflow-hidden">
        {/* 3. LEFT - Navigation Sidebar */}
        <Sidebar />
        {/* 4. MIDDLE - Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
        {/* 5. RIGHT - Aside with previews/actions */}
        <aside className="hidden lg:flex flex-col w-80 bg-white border-l border-slate-200 p-6 overflow-y-auto">
          <h2 className="font-bold text-xl mb-4">My Joke Book</h2>
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-sm italic text-slate-500">
              "You haven't saved any jokes yet..."
            </div>
          </div>

          {/* Create button */}
          <div className="mt-auto">
            <button className="w-full py-3 bg-purple-600 text-white rounded-xl font-bold shadow-lg shadow-purple-200 hover:bg-purple-700 transition-all active:scale-95">
              + Create New Joke
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default AppLayout;
