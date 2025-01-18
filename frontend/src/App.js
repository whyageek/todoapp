import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ProProvider } from './context/ProContext';
import HomePage from './pages/HomePage';
import ProPage from './pages/ProPage';
import LoginPage from './pages/LoginPage';
import ErrorPage from './pages/ErrorPage';

function App() {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) return <LoginPage />;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pro" element={<ProPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default function RootApp() {
  return (
    <AuthProvider>
      <ProProvider>
        <App />
      </ProProvider>
    </AuthProvider>
  );
}