import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/authContext"; 
import AuthPage from "./pages/AuthPage";
import Home from "./pages/HomePage";
import BlogPage from "./pages/Blog/BlogPage";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/home" element={<Home />} />
            <Route
              path="/blogs"
              element={
                <PrivateRoute>
                  <BlogPage />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/auth" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;