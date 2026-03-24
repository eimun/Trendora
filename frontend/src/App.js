import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import GapAnalysis from './components/GapAnalysis';
import PredictiveDashboard from './components/PredictiveDashboard';
import StyleTrainer from './components/StyleTrainer';
import AppLayout from './components/AppLayout';
import ErrorBoundary from './components/ErrorBoundary';
import axios from 'axios';

// Global Axios Interceptor for handling 401 Unauthorized errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (window.location.pathname !== '/login') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />

          {/* Authenticated routes with sidebar */}
          <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/gap-analysis" element={<AppLayout><GapAnalysis /></AppLayout>} />
          <Route path="/predictions" element={<AppLayout><PredictiveDashboard /></AppLayout>} />
          <Route path="/style-trainer" element={<AppLayout><StyleTrainer /></AppLayout>} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
