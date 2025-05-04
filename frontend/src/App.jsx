import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import HomePage from './pages/HomePage';
import CountryDetailPage from './pages/CountryDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CoverPage from './pages/CoverPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Routes>
            {/* Auth routes without Navbar */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Routes with Navbar */}
            <Route path="/home" element={
              <>
                <Navbar />
                <main className="flex-grow container mx-auto px-4 py-8">
                  <HomePage />
                </main>
                <Footer />
              </>
            } />
            <Route path="/country/:code" element={
              <>
                <Navbar />
                <main className="flex-grow container mx-auto px-4 py-8">
                  <CountryDetailPage />
                </main>
                <Footer />
              </>
            } />
            <Route path="/profile" element={
              <PrivateRoute>
                <Navbar />
                <main className="flex-grow container mx-auto px-4 py-8">
                  <ProfilePage />
                </main>
                <Footer />
              </PrivateRoute>
            } />
            
            {/* Redirect root to login */}
            <Route path="/" element={<CoverPage />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#363636',
              color: '#fff',
            },
            duration: 4000,
          }}
        />
      </AuthProvider>
    </Router>
  );
}

export default App;