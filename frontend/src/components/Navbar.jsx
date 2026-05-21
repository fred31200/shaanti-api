import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import ShaantiLogo from './ShaantiLogo';

const NAV_LINKS = [
  { to: '/cours', label: 'Les cours' },
  { to: '/salle', label: 'La salle' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen]       = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); setOpen(false); };
  const isActive = (path) => location.pathname === path;

  return (
    <nav
      style={{
        backgroundColor: scrolled ? 'rgba(253,250,245,0.92)' : '#FDFAF5',
        borderBottom: '1px solid #EDE0CC',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
        transition: 'background-color 0.3s ease, backdrop-filter 0.3s ease',
        boxShadow: scrolled ? '0 1px 16px rgba(139,99,64,0.07)' : 'none',
      }}
      className="sticky top-0 z-50"
    >
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo SVG officiel */}
        <Link to="/" className="flex items-center" aria-label="Shaanti — accueil">
          <ShaantiLogo
            width={120}
            className="transition-opacity hover:opacity-80"
            style={{ color: '#6F4E32' }}
          />
        </Link>

        {/* Liens desktop */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`font-body text-sm tracking-wider uppercase transition-colors ${
                isActive(l.to)
                  ? 'text-shaanti-700 border-b border-shaanti-500 pb-0.5'
                  : 'text-shaanti-500 hover:text-shaanti-800'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Auth desktop */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link
                to={user.role === 'pro' ? '/pro-espace' : '/espace'}
                className="font-body text-sm text-shaanti-600 hover:text-shaanti-800 flex items-center gap-1.5 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                Mon espace
              </Link>
              <button
                onClick={handleLogout}
                className="font-body text-sm text-shaanti-400 hover:text-shaanti-700 flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login"    className="btn-secondary py-2 px-4 text-xs">Connexion</Link>
              <Link to="/register" className="btn-primary  py-2 px-4 text-xs">Inscription</Link>
            </>
          )}
        </div>

        {/* Burger mobile */}
        <button
          className="md:hidden p-2 text-shaanti-600 rounded-lg hover:bg-shaanti-100 transition"
          onClick={() => setOpen(o => !o)}
          aria-label="Menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Menu mobile */}
      {open && (
        <div
          style={{ backgroundColor: '#F7F0E6', borderTop: '1px solid #EDE0CC' }}
          className="md:hidden px-6 py-5 space-y-4 animate-fade-in-up"
        >
          {NAV_LINKS.map(l => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block font-body text-sm uppercase tracking-wider text-shaanti-700 py-1"
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-shaanti-200 flex gap-3">
            {user ? (
              <>
                <Link
                  to={user.role === 'pro' ? '/pro-espace' : '/espace'}
                  onClick={() => setOpen(false)}
                  className="btn-secondary text-xs py-2"
                >
                  Mon espace
                </Link>
                <button onClick={handleLogout} className="btn-secondary text-xs py-2">
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/login"    onClick={() => setOpen(false)} className="btn-secondary text-xs py-2">Connexion</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="btn-primary  text-xs py-2">Inscription</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
