import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// Pages
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { Auth } from './pages/Auth';
import { Meetings } from './pages/Meetings';
import { Settings } from './pages/Settings';
// import { NotFound } from './pages/NotFound';

// Components
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth/*" element={<Auth />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/meetings/*" element={<Meetings />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            {/* 404 */}
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </Router>
        <Toaster position="top-center" />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;