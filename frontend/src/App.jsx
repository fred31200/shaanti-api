import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Search from './pages/Search';
import ProDetail from './pages/ProDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProDashboard from './pages/ProDashboard';
import RoomBooking from './pages/RoomBooking';

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FDFAF5' }}>
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cours" element={<Search />} />
            <Route path="/cours/:id" element={<ProDetail />} />
            <Route path="/salle" element={<RoomBooking />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/espace" element={<Dashboard />} />
            <Route path="/pro-espace" element={<ProDashboard />} />
          </Routes>
        </main>
        <footer style={{ backgroundColor: '#F7F0E6', borderTop: '1px solid #EDE0CC' }} className="py-10 mt-16">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <p className="font-sans text-2xl font-light text-shaanti-700 mb-2">Shaanti</p>
            <p className="font-body text-sm text-shaanti-500 tracking-wide">Centre de bien-être — Danse · Yoga · Pilates</p>
            <p className="font-body text-xs text-shaanti-400 mt-4">© 2026 Centre Shaanti — Tous droits réservés</p>
          </div>
        </footer>
      </div>
    </AuthProvider>
  );
}
