// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Login from './pages/Login/Login';
import FirstPage from './pages/FirstPage/FirstPage';
import ChangePassword from './pages/ChangePassword/ChangePassword';
import ConfirmCode from './pages/ConfirmCode/ConfirmCode';
import NewPassword from './pages/NewPassword/NewPassword';
import Things from './pages/Things/Things';
import styles from './app.module.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirect if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? children : <Navigate to="/first-page" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className={styles.app}>
          <Routes>
            {/* Public routes */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            <Route 
              path="/change-password" 
              element={
                <PublicRoute>
                  <ChangePassword />
                </PublicRoute>
              } 
            />
            <Route 
              path="/confirm-code" 
              element={
                <PublicRoute>
                  <ConfirmCode />
                </PublicRoute>
              } 
            />
            <Route 
              path="/new-password" 
              element={
                <PublicRoute>
                  <NewPassword />
                </PublicRoute>
              } 
            />

            {/* Protected routes */}
            <Route 
              path="/first-page" 
              element={
                <ProtectedRoute>
                  <FirstPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/things" 
              element={
                <ProtectedRoute>
                  <Things />
                </ProtectedRoute>
              } 
            />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* 404 fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;