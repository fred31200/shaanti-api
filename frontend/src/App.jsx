import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Mandala from './components/Mandala';
import ShaantiLogo from './components/ShaantiLogo';
import Home from './pages/Home';
import Search from './pages/Search';
import ProDetail from './pages/ProDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProDashboard from './pages/ProDashboard';
import RoomBooking from './pages/RoomBooking';
import { Link } from 'react-router-dom';
import { MapPin, ExternalLink } from 'lucide-react';

function Footer() {
  return (
    <footer
      style={{ backgroundColor: '#3D2B1F', borderTop: '1px solid #503828' }}
      className="relative overflow-hidden mt-16"
    >
      {/* Mandalas décoratifs */}
      <div className="absolute -top-24 -left-24 pointer-events-none select-none">
        <Mandala size={280} color="#FDFAF5" opacity={0.04} spin />
      </div>
      <div className="absolute -bottom-20 -right-20 pointer-events-none select-none">
        <Mandala size={220} color="#FDFAF5" opacity={0.03} spin reverse />
      </div>

      <div className="max-w-5xl mx-auto px-6 py-14 relative">
        <div className="grid md:grid-cols-3 gap-10 mb-12">

          {/* Bloc logo + tagline */}
          <div>
            <ShaantiLogo
              width={130}
              style={{ color: '#DCC5A8' }}
              className="mb-4 opacity-90"
            />
            <p className="font-body text-sm leading-relaxed" style={{ color: 'rgba(253,250,245,0.55)' }}>
              Votre espace bien-être pour le yoga,<br />
              la danse et le pilates à L'Union.
            </p>
            <a
              href="https://www.shaanti.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-4 font-body text-xs uppercase tracking-wider transition-colors"
              style={{ color: '#C4A07A' }}
            >
              <ExternalLink className="w-3 h-3" />
              shaanti.fr
            </a>
          </div>

          {/* Navigation */}
          <div>
            <p className="font-body text-xs uppercase tracking-[0.25em] mb-5" style={{ color: 'rgba(253,250,245,0.35)' }}>
              Navigation
            </p>
            <ul className="space-y-3">
              {[
                { to: '/',       label: 'Accueil' },
                { to: '/cours',  label: 'Les cours' },
                { to: '/salle',  label: 'Louer la salle' },
                { to: '/login',  label: 'Espace membre' },
              ].map(l => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="font-body text-sm transition-colors hover:opacity-100"
                    style={{ color: 'rgba(253,250,245,0.6)' }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Adresse */}
          <div>
            <p className="font-body text-xs uppercase tracking-[0.25em] mb-5" style={{ color: 'rgba(253,250,245,0.35)' }}>
              Nous trouver
            </p>
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#C4A07A' }} />
              <address className="not-italic font-body text-sm leading-relaxed" style={{ color: 'rgba(253,250,245,0.6)' }}>
                37, Route de Bessières<br />
                31240 L'Union<br />
                Toulouse, France
              </address>
            </div>
            <div className="mt-5 flex gap-2">
              {[
                { label: '🧘 Yoga',    cat: 'yoga' },
                { label: '💃 Danse',   cat: 'danse' },
                { label: '🤸 Pilates', cat: 'pilates' },
              ].map(d => (
                <Link
                  key={d.cat}
                  to={`/cours?category=${d.cat}`}
                  className="font-body text-xs px-3 py-1 rounded-full transition-all"
                  style={{
                    backgroundColor: 'rgba(220,197,168,0.12)',
                    color: '#DCC5A8',
                    border: '1px solid rgba(220,197,168,0.2)',
                  }}
                >
                  {d.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Barre de bas de footer */}
        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-2"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
        >
          <p className="font-body text-xs" style={{ color: 'rgba(253,250,245,0.25)' }}>
            © 2026 Centre Shaanti · Tous droits réservés
          </p>
          {/* Petit mandala décoratif central */}
          <Mandala size={28} color="#DCC5A8" opacity={0.4} />
          <p className="font-body text-xs" style={{ color: 'rgba(253,250,245,0.2)' }}>
            Yoga · Danse · Pilates
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FDFAF5' }}>
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/"          element={<Home />} />
            <Route path="/cours"     element={<Search />} />
            <Route path="/cours/:id" element={<ProDetail />} />
            <Route path="/salle"     element={<RoomBooking />} />
            <Route path="/login"     element={<Login />} />
            <Route path="/register"  element={<Register />} />
            <Route path="/espace"    element={<Dashboard />} />
            <Route path="/pro-espace" element={<ProDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
