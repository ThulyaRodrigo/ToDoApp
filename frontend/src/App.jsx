import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<Login onAuth={setUser} />}
        />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={
            !user ? (
              <Navigate to="/login" />
            ) : (
              <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow text-center">
                <h2 className="text-2xl font-bold mb-4">Welcome, {user.username}!</h2>
                <p className="mb-4">You are logged in.</p>
                {/* Task management UI will go here */}
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() => {
                    localStorage.removeItem('token');
                    setUser(null);
                  }}
                >
                  Logout
                </button>
              </div>
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
