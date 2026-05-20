import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'client', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await register(form);
      navigate(user.role === 'pro' ? '/pro-espace' : '/espace');
    } catch (e) {
      setError(e.response?.data?.error || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div style={{ backgroundColor: '#FDFAF5' }} className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <p className="font-sans text-3xl font-light text-shaanti-800 tracking-widest uppercase mb-2">Shaanti</p>
          <p className="font-body text-sm text-shaanti-400 tracking-wide">Créer votre compte</p>
        </div>

        <div style={{ backgroundColor: 'white', border: '1px solid #EDE0CC' }} className="rounded-2xl p-8">
          {error && (
            <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C' }}
              className="text-xs font-body p-3 rounded-xl mb-5">{error}</div>
          )}

          {/* Choix du rôle */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { role: 'client', label: 'Je prends des cours', sub: 'Participant' },
              { role: 'pro', label: 'Je donne des cours', sub: 'Instructeur' },
            ].map(r => (
              <button key={r.role} type="button" onClick={() => set('role', r.role)}
                style={form.role === r.role
                  ? { backgroundColor: '#F7F0E6', borderColor: '#A67C52' }
                  : { backgroundColor: 'white', borderColor: '#EDE0CC' }
                }
                className="p-4 rounded-xl border-2 text-center transition-all">
                <div className="font-body text-xs font-medium text-shaanti-700">{r.label}</div>
                <div className="font-body text-xs text-shaanti-400 mt-0.5">{r.sub}</div>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: 'name', label: 'Nom complet', type: 'text', placeholder: 'Marie Dupont', required: true },
              { key: 'email', label: 'Email', type: 'email', placeholder: 'vous@email.fr', required: true },
              { key: 'phone', label: 'Téléphone', type: 'text', placeholder: '06 12 34 56 78', required: false },
              { key: 'password', label: 'Mot de passe', type: 'password', placeholder: 'Min. 6 caractères', required: true },
            ].map(f => (
              <div key={f.key}>
                <label className="font-body text-xs uppercase tracking-wider text-shaanti-500 block mb-2">{f.label}</label>
                <input type={f.type} required={f.required} value={form[f.key]}
                  onChange={e => set(f.key, e.target.value)}
                  className="input text-sm" placeholder={f.placeholder} />
              </div>
            ))}
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-2">
              {loading ? 'Création...' : 'Créer mon compte'}
            </button>
          </form>

          <p className="text-center font-body text-xs text-shaanti-400 mt-5">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-shaanti-600 hover:underline">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
