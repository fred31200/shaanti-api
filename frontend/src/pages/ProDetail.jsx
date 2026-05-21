import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Clock, ChevronLeft, ChevronRight, Check, ArrowLeft } from 'lucide-react';
import { format, addDays, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import Mandala from '../components/Mandala';

const CAT_EMOJI = { yoga: '🧘', danse: '💃', pilates: '🤸' };
const CAT_BG    = { yoga: '#F7F0E6', danse: '#F2EBF7', pilates: '#EBF2F7' };
const CAT_COLOR = { yoga: '#A67C52', danse: '#7B52A6', pilates: '#3A6B8A' };

export default function ProDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pro, setPro] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [success, setSuccess] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);

  useEffect(() => {
    Promise.all([
      api.get(`/professionals/${id}`),
      api.get(`/professionals/${id}/availability`)
    ]).then(([proRes, availRes]) => {
      setPro(proRes.data);
      setAvailableDates(availRes.data);
      if (availRes.data.length > 0) setSelectedDate(availRes.data[0]);
    }).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!selectedDate) return;
    api.get(`/professionals/${id}/slots`, { params: { date: selectedDate } })
      .then(r => setSlots(r.data));
  }, [selectedDate, id]);

  const handleBook = async () => {
    if (!user) { navigate('/login'); return; }
    if (!selectedService || !selectedSlot) return;
    setBooking(true);
    try {
      await api.post('/bookings', {
        professional_id: pro.id,
        service_id: selectedService.id,
        slot_id: selectedSlot.id
      });
      setSuccess(true);
      setSlots(prev => prev.filter(s => s.id !== selectedSlot.id));
      setSelectedSlot(null);
    } catch (e) {
      alert(e.response?.data?.error || 'Erreur lors de la réservation');
    } finally {
      setBooking(false);
    }
  };

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(new Date(), weekOffset * 7 + i + 1);
    return d.toISOString().split('T')[0];
  });

  if (loading) return (
    <div style={{ backgroundColor: '#FDFAF5' }} className="min-h-screen flex items-center justify-center">
      <p className="font-body text-shaanti-400">Chargement...</p>
    </div>
  );
  if (!pro) return (
    <div style={{ backgroundColor: '#FDFAF5' }} className="min-h-screen flex items-center justify-center">
      <p className="font-body text-shaanti-400">Cours introuvable</p>
    </div>
  );

  const bgColor = CAT_BG[pro.category] || '#F7F0E6';

  return (
    <div style={{ backgroundColor: '#FDFAF5' }} className="min-h-screen">
      {/* Header avec photo du coach */}
      <div
        style={{ backgroundColor: bgColor, borderBottom: '1px solid #EDE0CC' }}
        className="relative overflow-hidden"
      >
        {/* Mandala déco */}
        <div className="absolute -right-16 -top-16 pointer-events-none select-none">
          <Mandala size={260} color={CAT_COLOR[pro.category] || '#A67C52'} opacity={0.08} spin />
        </div>

        <div className="max-w-5xl mx-auto px-6 py-10 relative">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 font-body text-sm text-shaanti-500 hover:text-shaanti-700 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Retour aux cours
          </button>

          <div className="flex items-center gap-6">
            {/* Avatar / photo */}
            <div
              className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden flex-shrink-0 shadow-md"
              style={{ border: `3px solid ${CAT_COLOR[pro.category] || '#A67C52'}40` }}
            >
              {pro.avatar ? (
                <img
                  src={pro.avatar}
                  alt={pro.name}
                  className="w-full h-full object-cover"
                  onError={e => {
                    e.target.style.display = 'none';
                    e.target.parentNode.style.display = 'flex';
                    e.target.parentNode.style.alignItems = 'center';
                    e.target.parentNode.style.justifyContent = 'center';
                    e.target.parentNode.style.fontSize = '2.5rem';
                    e.target.parentNode.style.backgroundColor = bgColor;
                    e.target.parentNode.innerHTML = CAT_EMOJI[pro.category] || '✨';
                  }}
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-4xl"
                  style={{ backgroundColor: bgColor }}
                >
                  {CAT_EMOJI[pro.category] || '✨'}
                </div>
              )}
            </div>

            <div>
              <p
                className="font-body text-xs uppercase tracking-[0.3em] mb-1"
                style={{ color: CAT_COLOR[pro.category] || '#A67C52' }}
              >
                {pro.category}
              </p>
              <h1 className="font-sans text-3xl md:text-4xl font-light text-shaanti-800">{pro.name}</h1>
              {pro.rating > 0 && (
                <div className="flex items-center gap-1.5 mt-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${i < Math.round(pro.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-shaanti-200'}`}
                    />
                  ))}
                  <span className="font-body text-sm text-shaanti-500 ml-1">
                    {pro.rating.toFixed(1)} · {pro.review_count} avis
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-5 gap-8">

          {/* Colonne gauche */}
          <div className="md:col-span-2 space-y-6">
            {/* Bio */}
            <div>
              <p className="font-body text-xs uppercase tracking-[0.3em] text-shaanti-400 mb-3">À propos</p>
              <p className="font-body text-sm text-shaanti-600 leading-relaxed">{pro.bio}</p>
              {pro.specialties && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {pro.specialties.split(',').map(s => (
                    <span key={s} style={{ backgroundColor: '#F7F0E6', color: '#8B6340', border: '1px solid #DCC5A8' }}
                      className="text-xs font-body px-3 py-1 rounded-full">{s.trim()}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Cours / tarifs */}
            <div>
              <p className="font-body text-xs uppercase tracking-[0.3em] text-shaanti-400 mb-3">Cours & tarifs</p>
              <div className="space-y-2">
                {pro.services?.map(s => (
                  <button key={s.id} onClick={() => setSelectedService(s)}
                    style={{
                      backgroundColor: selectedService?.id === s.id ? '#F7F0E6' : 'white',
                      borderColor: selectedService?.id === s.id ? '#A67C52' : '#EDE0CC'
                    }}
                    className="w-full text-left p-4 rounded-xl border-2 transition-all">
                    <div className="flex justify-between items-start">
                      <span className="font-body text-sm font-medium text-shaanti-800">{s.name}</span>
                      <span className="font-body text-sm font-medium text-shaanti-600">{s.price}€</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-body text-shaanti-400 mt-1">
                      <Clock className="w-3 h-3" /> {s.duration} min
                    </div>
                    {s.description && <p className="font-body text-xs text-shaanti-400 mt-1 leading-relaxed">{s.description}</p>}
                  </button>
                ))}
              </div>
            </div>

            {/* Avis */}
            {pro.reviews?.length > 0 && (
              <div>
                <p className="font-body text-xs uppercase tracking-[0.3em] text-shaanti-400 mb-3">Avis</p>
                <div className="space-y-3">
                  {pro.reviews.slice(0, 4).map(r => (
                    <div key={r.id} style={{ backgroundColor: '#F7F0E6', border: '1px solid #EDE0CC' }} className="rounded-xl p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-body text-xs font-medium text-shaanti-700">{r.client_name}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < r.rating ? 'fill-shaanti-400 text-shaanti-400' : 'text-shaanti-200'}`} />
                          ))}
                        </div>
                      </div>
                      {r.comment && <p className="font-body text-xs text-shaanti-500 leading-relaxed">{r.comment}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Colonne droite — Calendrier */}
          <div className="md:col-span-3">
            <div style={{ backgroundColor: 'white', border: '1px solid #EDE0CC' }} className="rounded-2xl p-6">
              <p className="font-body text-xs uppercase tracking-[0.3em] text-shaanti-400 mb-5">Choisir un créneau</p>

              {/* Navigation semaine */}
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => setWeekOffset(w => Math.max(0, w - 1))} disabled={weekOffset === 0}
                  className="p-1.5 rounded-lg hover:bg-shaanti-100 disabled:opacity-30 transition">
                  <ChevronLeft className="w-4 h-4 text-shaanti-600" />
                </button>
                <span className="font-body text-xs text-shaanti-500 uppercase tracking-wider">
                  {format(addDays(new Date(), weekOffset * 7 + 1), 'MMMM yyyy', { locale: fr })}
                </span>
                <button onClick={() => setWeekOffset(w => w + 1)} className="p-1.5 rounded-lg hover:bg-shaanti-100 transition">
                  <ChevronRight className="w-4 h-4 text-shaanti-600" />
                </button>
              </div>

              {/* Jours */}
              <div className="grid grid-cols-7 gap-1 mb-6">
                {weekDays.map(day => {
                  const hasSlots = availableDates.includes(day);
                  const isSelected = selectedDate === day;
                  const d = parseISO(day);
                  return (
                    <button key={day} onClick={() => hasSlots && setSelectedDate(day)} disabled={!hasSlots}
                      style={isSelected
                        ? { backgroundColor: '#8B6340', color: '#FDFAF5' }
                        : hasSlots ? {} : {}
                      }
                      className={`flex flex-col items-center py-2.5 px-1 rounded-xl transition-all text-xs ${
                        isSelected ? '' :
                        hasSlots ? 'hover:bg-shaanti-100 text-shaanti-700 cursor-pointer' :
                        'text-shaanti-300 cursor-not-allowed'
                      }`}>
                      <span className="text-xs uppercase opacity-60 font-body">
                        {format(d, 'EEE', { locale: fr }).slice(0, 2)}
                      </span>
                      <span className="text-base font-sans font-light mt-0.5">{format(d, 'd')}</span>
                      {hasSlots && !isSelected && (
                        <div style={{ backgroundColor: '#A67C52' }} className="w-1 h-1 rounded-full mt-1" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Créneaux */}
              {selectedDate && (
                <>
                  <p className="font-body text-xs text-shaanti-500 mb-3 capitalize">
                    {format(parseISO(selectedDate), 'EEEE d MMMM', { locale: fr })}
                  </p>
                  {slots.length === 0 ? (
                    <p className="font-body text-sm text-shaanti-400 text-center py-4">Aucun créneau ce jour</p>
                  ) : (
                    <div className="grid grid-cols-4 gap-2">
                      {slots.map(s => (
                        <button key={s.id} onClick={() => setSelectedSlot(s)}
                          style={selectedSlot?.id === s.id
                            ? { backgroundColor: '#8B6340', color: '#FDFAF5', borderColor: '#8B6340' }
                            : { backgroundColor: '#FDFAF5', borderColor: '#EDE0CC' }
                          }
                          className="py-2.5 px-2 rounded-xl text-xs font-body font-medium transition-all border hover:border-shaanti-400">
                          {s.start_time}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Récap réservation */}
              {selectedService && selectedSlot && !success && (
                <div style={{ backgroundColor: '#F7F0E6', border: '1px solid #DCC5A8' }} className="mt-6 p-4 rounded-xl">
                  <div className="flex justify-between font-body text-sm text-shaanti-700 mb-1">
                    <span>{selectedService.name}</span>
                    <span className="font-medium">{selectedService.price}€</span>
                  </div>
                  <p className="font-body text-xs text-shaanti-500 mb-4 capitalize">
                    {format(parseISO(selectedDate), 'EEEE d MMMM', { locale: fr })} à {selectedSlot.start_time}
                  </p>
                  <button onClick={handleBook} disabled={booking} className="btn-primary w-full justify-center text-sm">
                    {booking ? 'Réservation...' : 'Confirmer'}
                  </button>
                </div>
              )}

              {success && (
                <div style={{ backgroundColor: '#F0F7EE', border: '1px solid #B8D4B0' }} className="mt-6 p-5 rounded-xl text-center">
                  <Check className="w-8 h-8 mx-auto mb-2" style={{ color: '#5A8A52' }} />
                  <p className="font-body text-sm font-medium text-shaanti-800">Réservation confirmée !</p>
                  <button onClick={() => navigate('/espace')} className="font-body text-xs text-shaanti-500 underline mt-2">
                    Voir mes réservations
                  </button>
                </div>
              )}

              {!selectedService && (
                <p className="font-body text-xs text-shaanti-400 mt-4 text-center">
                  ← Sélectionnez d'abord un cours
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
