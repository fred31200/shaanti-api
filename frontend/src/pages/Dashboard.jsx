import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar, Clock, Star, X } from 'lucide-react';
import { format, parseISO, isPast } from 'date-fns';
import { fr } from 'date-fns/locale';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('upcoming');
  const [reviewModal, setReviewModal] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    api.get('/bookings/my').then(r => setBookings(r.data)).finally(() => setLoading(false));
  }, [user]);

  const cancel = async (id) => {
    if (!confirm('Annuler cette réservation ?')) return;
    try {
      await api.delete(`/bookings/${id}`);
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
    } catch (e) { alert(e.response?.data?.error || 'Erreur'); }
  };

  const submitReview = async () => {
    try {
      await api.post(`/bookings/${reviewModal.id}/review`, { rating, comment });
      setReviewModal(null); setRating(5); setComment('');
    } catch (e) { alert(e.response?.data?.error || 'Erreur'); }
  };

  const upcoming = bookings.filter(b => !isPast(parseISO(`${b.date}T${b.end_time}`)) && b.status === 'confirmed');
  const past = bookings.filter(b => isPast(parseISO(`${b.date}T${b.end_time}`)) || b.status === 'cancelled');
  const displayed = tab === 'upcoming' ? upcoming : past;

  return (
    <div style={{ backgroundColor: '#FDFAF5' }} className="min-h-screen">
      <div style={{ backgroundColor: '#F7F0E6', borderBottom: '1px solid #EDE0CC' }} className="py-12">
        <div className="max-w-3xl mx-auto px-6 flex items-end justify-between">
          <div>
            <p className="font-body text-xs uppercase tracking-[0.3em] text-shaanti-400 mb-2">Shaanti</p>
            <h1 className="section-title">Mon espace</h1>
            <p className="font-body text-sm text-shaanti-500 mt-1">Bonjour, {user?.name?.split(' ')[0]} !</p>
          </div>
          <Link to="/cours" className="btn-primary text-xs">Réserver un cours</Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Onglets */}
        <div className="flex gap-1 p-1 rounded-full w-fit mb-8" style={{ backgroundColor: '#F7F0E6', border: '1px solid #EDE0CC' }}>
          {[
            { key: 'upcoming', label: `À venir (${upcoming.length})` },
            { key: 'past', label: `Passées (${past.length})` },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={tab === t.key ? { backgroundColor: 'white', color: '#3D2B1F' } : { color: '#9E8070' }}
              className="px-5 py-2 rounded-full text-xs font-body font-medium transition-all shadow-none">
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} style={{ backgroundColor: '#F7F0E6' }} className="rounded-2xl h-20 animate-pulse" />
            ))}
          </div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="w-10 h-10 mx-auto mb-3 text-shaanti-300" />
            <p className="font-sans text-xl font-light text-shaanti-400">
              {tab === 'upcoming' ? 'Aucun cours à venir' : 'Aucun historique'}
            </p>
            {tab === 'upcoming' && (
              <Link to="/cours" className="font-body text-xs text-shaanti-500 underline mt-2 block">
                Découvrir les cours
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {displayed.map(b => {
              const isDone = isPast(parseISO(`${b.date}T${b.end_time}`));
              return (
                <div key={b.id} style={{ backgroundColor: 'white', border: '1px solid #EDE0CC', opacity: b.status === 'cancelled' ? 0.6 : 1 }}
                  className="rounded-2xl p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-sans text-base font-light text-shaanti-800">{b.pro_name}</span>
                        <span style={
                          b.status === 'cancelled'
                            ? { backgroundColor: '#FEF2F2', color: '#B91C1C' }
                            : isDone ? { backgroundColor: '#F7F0E6', color: '#9E8070' }
                            : { backgroundColor: '#F0F7EE', color: '#5A8A52' }
                        } className="text-xs font-body px-2 py-0.5 rounded-full">
                          {b.status === 'cancelled' ? 'Annulé' : isDone ? 'Terminé' : 'Confirmé'}
                        </span>
                      </div>
                      <p className="font-body text-xs text-shaanti-500 mb-2">{b.service_name}</p>
                      <div className="flex flex-wrap gap-4 text-xs font-body text-shaanti-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {format(parseISO(b.date), 'EEEE d MMMM', { locale: fr })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {b.start_time}
                        </span>
                      </div>
                    </div>
                    <div className="text-right ml-4 flex-shrink-0">
                      <div className="font-body text-sm font-medium text-shaanti-700">{b.price}€</div>
                      {!isDone && b.status === 'confirmed' && (
                        <button onClick={() => cancel(b.id)}
                          className="text-xs font-body text-shaanti-400 hover:text-red-500 mt-2 flex items-center gap-1 transition-colors">
                          <X className="w-3 h-3" /> Annuler
                        </button>
                      )}
                      {isDone && b.status === 'confirmed' && (
                        <button onClick={() => setReviewModal(b)}
                          className="text-xs font-body text-shaanti-500 hover:text-shaanti-700 mt-2 flex items-center gap-1 transition-colors">
                          <Star className="w-3 h-3" /> Laisser un avis
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal avis */}
      {reviewModal && (
        <div className="fixed inset-0 bg-shaanti-900/40 flex items-center justify-center z-50 px-6 backdrop-blur-sm">
          <div style={{ backgroundColor: 'white', border: '1px solid #EDE0CC' }} className="rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-sans text-xl font-light text-shaanti-800 mb-1">Votre avis</h3>
            <p className="font-body text-xs text-shaanti-400 mb-5">{reviewModal.pro_name} · {reviewModal.service_name}</p>
            <div className="flex gap-2 mb-5">
              {[1,2,3,4,5].map(s => (
                <button key={s} onClick={() => setRating(s)}>
                  <Star className={`w-7 h-7 transition-colors ${s <= rating ? 'fill-shaanti-400 text-shaanti-400' : 'text-shaanti-200'}`} />
                </button>
              ))}
            </div>
            <textarea value={comment} onChange={e => setComment(e.target.value)}
              placeholder="Votre commentaire (optionnel)"
              rows={3} className="input text-sm mb-4 resize-none" />
            <div className="flex gap-2">
              <button onClick={() => setReviewModal(null)} className="btn-secondary flex-1 text-xs">Annuler</button>
              <button onClick={submitReview} className="btn-primary flex-1 text-xs">Publier</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
