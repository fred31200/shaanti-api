import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Users, Star, Euro } from 'lucide-react';
import { format, parseISO, isPast } from 'date-fns';
import { fr } from 'date-fns/locale';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function ProDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('upcoming');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (user.role !== 'pro') { navigate('/espace'); return; }
    api.get('/professionals/dashboard/me').then(r => setData(r.data)).finally(() => setLoading(false));
  }, [user]);

  if (loading) return (
    <div style={{ backgroundColor: '#FDFAF5' }} className="min-h-screen flex items-center justify-center">
      <p className="font-body text-shaanti-400">Chargement...</p>
    </div>
  );
  if (!data) return null;

  const { stats, bookings } = data;
  const upcoming = bookings.filter(b => !isPast(parseISO(`${b.date}T${b.end_time}`)) && b.status === 'confirmed');
  const past = bookings.filter(b => isPast(parseISO(`${b.date}T${b.end_time}`)) || b.status === 'cancelled');
  const displayed = tab === 'upcoming' ? upcoming : past;

  return (
    <div style={{ backgroundColor: '#FDFAF5' }} className="min-h-screen">
      <div style={{ backgroundColor: '#F7F0E6', borderBottom: '1px solid #EDE0CC' }} className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <p className="font-body text-xs uppercase tracking-[0.3em] text-shaanti-400 mb-2">Shaanti</p>
          <h1 className="section-title">Tableau de bord</h1>
          <p className="font-body text-sm text-shaanti-500 mt-1">Bonjour, {user?.name?.split(' ')[0]} !</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Réservations', value: stats.total, icon: <Calendar className="w-5 h-5 text-shaanti-500" /> },
            { label: 'À venir', value: stats.upcoming, icon: <Clock className="w-5 h-5 text-shaanti-500" /> },
            { label: 'Revenus', value: `${stats.revenue}€`, icon: <Euro className="w-5 h-5 text-shaanti-500" /> },
            { label: 'Note', value: data.pro.rating > 0 ? data.pro.rating.toFixed(1) : '–', icon: <Star className="w-5 h-5 text-shaanti-500" /> },
          ].map(s => (
            <div key={s.label} style={{ backgroundColor: 'white', border: '1px solid #EDE0CC' }} className="rounded-2xl p-5">
              <div className="flex items-center gap-3">
                {s.icon}
                <div>
                  <div className="font-sans text-2xl font-light text-shaanti-800">{s.value}</div>
                  <div className="font-body text-xs text-shaanti-400 uppercase tracking-wide">{s.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Onglets */}
        <div className="flex gap-1 p-1 rounded-full w-fit mb-6" style={{ backgroundColor: '#F7F0E6', border: '1px solid #EDE0CC' }}>
          {[
            { key: 'upcoming', label: `À venir (${upcoming.length})` },
            { key: 'past', label: `Passés (${past.length})` },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={tab === t.key ? { backgroundColor: 'white', color: '#3D2B1F' } : { color: '#9E8070' }}
              className="px-5 py-2 rounded-full text-xs font-body font-medium transition-all">
              {t.label}
            </button>
          ))}
        </div>

        {displayed.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="w-10 h-10 mx-auto mb-3 text-shaanti-300" />
            <p className="font-sans text-xl font-light text-shaanti-400">
              {tab === 'upcoming' ? 'Aucun cours à venir' : 'Aucun historique'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayed.map(b => {
              const isDone = isPast(parseISO(`${b.date}T${b.end_time}`));
              return (
                <div key={b.id} style={{ backgroundColor: 'white', border: '1px solid #EDE0CC', opacity: b.status === 'cancelled' ? 0.6 : 1 }}
                  className="rounded-2xl p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-shaanti-400" />
                        <span className="font-body text-sm font-medium text-shaanti-800">{b.client_name}</span>
                        {b.client_phone && <span className="font-body text-xs text-shaanti-400">{b.client_phone}</span>}
                      </div>
                      <p className="font-body text-xs text-shaanti-500 mb-2">{b.service_name} · {b.duration} min</p>
                      <div className="flex flex-wrap gap-4 text-xs font-body text-shaanti-400">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{format(parseISO(b.date), 'EEEE d MMMM', { locale: fr })}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{b.start_time}</span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="font-body text-sm font-medium text-shaanti-700">{b.price}€</div>
                      <span style={
                        b.status === 'cancelled' ? { color: '#B91C1C' } :
                        isDone ? { color: '#9E8070' } : { color: '#5A8A52' }
                      } className="font-body text-xs mt-1 block">
                        {b.status === 'cancelled' ? 'Annulé' : isDone ? 'Terminé' : 'Confirmé'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
