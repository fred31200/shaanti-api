import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { format, addDays, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const FEATURES = [
  'Parquet bois & miroirs sur toute la largeur',
  'Barres de danse fixes et portables',
  'Système audio intégré (Bluetooth)',
  'Vestiaires et douches',
  'Climatisation reversible',
  'Capacité jusqu\'à 20 personnes',
];

export default function RoomBooking() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [slots, setSlots] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [purpose, setPurpose] = useState('');
  const [weekOffset, setWeekOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    api.get('/room/availability')
      .then(r => {
        setAvailableDates(r.data);
        if (r.data.length > 0) setSelectedDate(r.data[0]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedDate) return;
    api.get('/room/slots', { params: { date: selectedDate } }).then(r => setSlots(r.data));
  }, [selectedDate]);

  const handleBook = async () => {
    if (!user) { navigate('/login'); return; }
    if (!selectedSlot) return;
    setBooking(true);
    try {
      await api.post('/room/book', { slot_id: selectedSlot.id, purpose });
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

  return (
    <div style={{ backgroundColor: '#FDFAF5' }} className="min-h-screen">
      {/* Header */}
      <div style={{ backgroundColor: '#F7F0E6', borderBottom: '1px solid #EDE0CC' }} className="py-12">
        <div className="max-w-5xl mx-auto px-6">
          <p className="font-body text-xs uppercase tracking-[0.3em] text-shaanti-400 mb-2">Centre Shaanti</p>
          <h1 className="section-title mb-3">Louer la salle</h1>
          <p className="font-body text-sm text-shaanti-500 max-w-md leading-relaxed">
            Notre salle est disponible pour vos cours privés, répétitions, ateliers ou événements bien-être.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-5 gap-8">

          {/* Infos salle */}
          <div className="md:col-span-2 space-y-6">
            <div style={{ backgroundColor: '#F7F0E6' }} className="rounded-2xl h-48 flex items-center justify-center text-6xl">
              🏛️
            </div>

            <div>
              <p className="font-body text-xs uppercase tracking-[0.3em] text-shaanti-400 mb-4">Équipements</p>
              <ul className="space-y-2.5">
                {FEATURES.map(f => (
                  <li key={f} className="flex items-start gap-2.5 font-body text-sm text-shaanti-600">
                    <span style={{ backgroundColor: '#DCC5A8' }} className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ backgroundColor: 'white', border: '1px solid #EDE0CC' }} className="rounded-2xl p-5">
              <p className="font-body text-xs uppercase tracking-[0.3em] text-shaanti-400 mb-3">Tarif</p>
              <div className="font-sans text-3xl font-light text-shaanti-800">25€ <span className="text-base text-shaanti-400">/ heure</span></div>
              <p className="font-body text-xs text-shaanti-400 mt-1">Facturation à l'heure, sans minimum</p>
            </div>
          </div>

          {/* Calendrier */}
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
                      style={isSelected ? { backgroundColor: '#8B6340', color: '#FDFAF5' } : {}}
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
              {loading ? (
                <div style={{ backgroundColor: '#F7F0E6' }} className="rounded-xl h-20 animate-pulse" />
              ) : selectedDate && (
                <>
                  <p className="font-body text-xs text-shaanti-500 mb-3 capitalize">
                    {format(parseISO(selectedDate), 'EEEE d MMMM', { locale: fr })}
                  </p>
                  {slots.length === 0 ? (
                    <p className="font-body text-sm text-shaanti-400 text-center py-4">Aucun créneau disponible ce jour</p>
                  ) : (
                    <div className="grid grid-cols-4 gap-2 mb-4">
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

              {/* Objet de la réservation + confirmation */}
              {selectedSlot && !success && (
                <div style={{ backgroundColor: '#F7F0E6', border: '1px solid #DCC5A8' }} className="mt-4 p-4 rounded-xl">
                  <div className="flex justify-between font-body text-sm text-shaanti-700 mb-3">
                    <span>Location de salle</span>
                    <span className="font-medium">25€</span>
                  </div>
                  <p className="font-body text-xs text-shaanti-500 mb-3 capitalize">
                    {format(parseISO(selectedDate), 'EEEE d MMMM', { locale: fr })} de {selectedSlot.start_time} à {selectedSlot.end_time}
                  </p>
                  <textarea
                    value={purpose}
                    onChange={e => setPurpose(e.target.value)}
                    placeholder="Objet de la location (cours privé, répétition, atelier...)"
                    rows={2}
                    className="input text-xs mb-3 resize-none"
                  />
                  <button onClick={handleBook} disabled={booking} className="btn-primary w-full justify-center text-sm">
                    {booking ? 'Réservation...' : 'Confirmer la réservation'}
                  </button>
                </div>
              )}

              {success && (
                <div style={{ backgroundColor: '#F0F7EE', border: '1px solid #B8D4B0' }} className="mt-4 p-5 rounded-xl text-center">
                  <Check className="w-8 h-8 mx-auto mb-2" style={{ color: '#5A8A52' }} />
                  <p className="font-body text-sm font-medium text-shaanti-800">Salle réservée !</p>
                  <p className="font-body text-xs text-shaanti-500 mt-1">Vous recevrez une confirmation par email.</p>
                  <button onClick={() => navigate('/espace')} className="font-body text-xs text-shaanti-500 underline mt-2">
                    Mon espace
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
