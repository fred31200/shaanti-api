import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'pro' ? '/pro-espace' : '/espace');
    } catch (e) {
      setError(e.response?.data?.error || 'Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  };

  const fill = (email) => setForm({ email, password: 'demo123' });

  return (
    <div style={{ backgroundColor: '#FDFAF5' }} className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <p className="font-sans text-3xl font-light text-shaanti-800 tracking-widest uppercase mb-2">Shaanti</p>
          <p className="font-body text-sm text-shaanti-400 tracking-wide">Connexion à votre espace</p>
        </div>

        <div style={{ backgroundColor: 'white', border: '1px solid #EDE0CC' }} className="rounded-2xl p-8">
          {error && (
            <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C' }}
              className="text-xs font-body p-3 rounded-xl mb-5">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-body text-xs uppercase tracking-wider text-shaanti-500 block mb-2">Email</label>
              <input type="email" required value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="input text-sm" placeholder="vous@email.fr" />
            </div>
            <div>
              <label className="font-body text-xs uppercase tracking-wider text-shaanti-500 block mb-2">Mot de passe</label>
              <input type="password" required value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="input text-sm" placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-2">
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          {/* Comptes démo */}
          <div className="mt-6 pt-5" style={{ borderTop: '1px solid #EDE0CC' }}>
            <p className="font-body text-xs text-shaanti-400 mb-3 text-center tracking-wide">Comptes de démonstration</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Client', email: 'client@demo.fr' },
                { label: 'Yoga — Léa', email: 'lea@yoga.fr' },
                { label: 'Danse — Marie', email: 'marie@danse.fr' },
                { label: 'Pilates — Clara', email: 'clara@pilates.fr' },
              ].map(d => (
                <button key={d.email} onClick={() => fill(d.email)}
                  style={{ backgroundColor: '#F7F0E6', border: '1px solid #EDE0CC' }}
                  className="text-xs font-body text-shaanti-600 hover:text-shaanti-800 px-3 py-2 rounded-xl transition text-left">
                  <span className="font-medium block">{d.label}</span>
                  <span className="text-shaanti-400 text-xs">{d.email}</span>
                </button>
              ))}
            </div>
          </div>

          <p className="text-center font-body text-xs text-shaanti-400 mt-5">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-shaanti-600 hover:underline">S'inscrire</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
