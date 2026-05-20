import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import api from '../api';
import CourseCard from '../components/ProCard';

const CATEGORIES = [
  { id: '', label: 'Tous les cours' },
  { id: 'yoga', label: 'Yoga', emoji: '🧘' },
  { id: 'danse', label: 'Danse', emoji: '💃' },
  { id: 'pilates', label: 'Pilates', emoji: '🤸' },
];

export default function Search() {
  const [params, setParams] = useSearchParams();
  const [pros, setPros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState(params.get('q') || '');
  const [category, setCategory] = useState(params.get('category') || '');

  const fetchPros = useCallback(async (cat, query) => {
    setLoading(true);
    try {
      const p = {};
      if (query) p.q = query;
      if (cat) p.category = cat;
      const { data } = await api.get('/professionals', { params: p });
      setPros(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPros(category, q); }, [category]);

  const handleSearch = (e) => { e.preventDefault(); fetchPros(category, q); };

  const handleCategory = (cat) => {
    setCategory(cat);
    const np = new URLSearchParams(params);
    if (cat) np.set('category', cat); else np.delete('category');
    setParams(np);
  };

  return (
    <div style={{ backgroundColor: '#FDFAF5' }} className="min-h-screen">
      {/* Header */}
      <div style={{ backgroundColor: '#F7F0E6', borderBottom: '1px solid #EDE0CC' }} className="py-12">
        <div className="max-w-5xl mx-auto px-6">
          <p className="font-body text-xs uppercase tracking-[0.3em] text-shaanti-400 mb-2">Shaanti</p>
          <h1 className="section-title mb-6">Nos cours</h1>
          <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-shaanti-400" />
              <input
                type="text"
                placeholder="Yoga, danse, pilates..."
                value={q}
                onChange={e => setQ(e.target.value)}
                className="input pl-11 text-sm"
              />
            </div>
            <button type="submit" className="btn-primary text-xs px-5">Rechercher</button>
          </form>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Filtres */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategory(cat.id)}
              style={category === cat.id
                ? { backgroundColor: '#8B6340', color: '#FDFAF5', borderColor: '#8B6340' }
                : { backgroundColor: 'white', color: '#6F4E32', borderColor: '#EDE0CC' }
              }
              className="px-5 py-2 rounded-full text-xs font-body font-medium border tracking-wide transition-all"
            >
              {cat.emoji && <span className="mr-1.5">{cat.emoji}</span>}
              {cat.label}
            </button>
          ))}
        </div>

        {/* Résultats */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ backgroundColor: '#F7F0E6' }} className="rounded-2xl h-64 animate-pulse" />
            ))}
          </div>
        ) : pros.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-sans text-2xl font-light text-shaanti-400 mb-2">Aucun cours trouvé</p>
            <p className="font-body text-sm text-shaanti-400">Essayez une autre catégorie</p>
          </div>
        ) : (
          <>
            <p className="font-body text-xs text-shaanti-400 mb-5 tracking-wide">
              {pros.length} cours disponible{pros.length > 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pros.map(pro => <CourseCard key={pro.id} pro={pro} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
