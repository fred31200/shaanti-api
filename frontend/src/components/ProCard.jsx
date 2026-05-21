import { Link } from 'react-router-dom';
import { Star, ArrowRight } from 'lucide-react';

const CATEGORY_CONFIG = {
  yoga:    { label: 'Yoga',    emoji: '🧘', bg: '#F5EDE0', color: '#8B6340', accent: '#A67C52' },
  danse:   { label: 'Danse',   emoji: '💃', bg: '#F0EBF5', color: '#6B4E8A', accent: '#7B52A6' },
  pilates: { label: 'Pilates', emoji: '🤸', bg: '#EBF0F5', color: '#3A6B8A', accent: '#4A85A8' },
};

export default function CourseCard({ pro }) {
  const cat  = CATEGORY_CONFIG[pro.category] || { label: pro.category, emoji: '✨', bg: '#F5EDE0', color: '#8B6340', accent: '#A67C52' };
  const specs = pro.specialties ? pro.specialties.split(',').slice(0, 3) : [];

  return (
    <Link
      to={`/cours/${pro.id}`}
      className="card hover:shadow-xl hover:-translate-y-1 block group transition-all duration-300 overflow-hidden"
    >
      {/* Photo ou emoji */}
      <div className="relative overflow-hidden" style={{ height: '180px' }}>
        {pro.avatar ? (
          <>
            <img
              src={pro.avatar}
              alt={pro.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={e => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            {/* Fallback si image cassée */}
            <div
              className="w-full h-full items-center justify-center text-5xl hidden"
              style={{ backgroundColor: cat.bg, position: 'absolute', top: 0, left: 0 }}
            >
              {cat.emoji}
            </div>
          </>
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-5xl"
            style={{ backgroundColor: cat.bg }}
          >
            {cat.emoji}
          </div>
        )}

        {/* Dégradé bas */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Badge discipline */}
        <div
          className="absolute top-3 left-3 text-xs font-body font-medium px-3 py-1 rounded-full tracking-wide"
          style={{
            backgroundColor: cat.bg + 'ee',
            color: cat.color,
            border: `1px solid ${cat.color}33`,
            backdropFilter: 'blur(6px)',
          }}
        >
          {cat.emoji} {cat.label}
        </div>

        {/* Note */}
        {pro.rating > 0 && (
          <div
            className="absolute top-3 right-3 flex items-center gap-1 text-xs font-body px-2 py-1 rounded-full"
            style={{ backgroundColor: 'rgba(0,0,0,0.35)', color: 'white', backdropFilter: 'blur(6px)' }}
          >
            <Star className="w-3 h-3 fill-yellow-300 text-yellow-300" />
            {pro.rating.toFixed(1)}
          </div>
        )}
      </div>

      <div className="p-5">
        {/* Nom */}
        <h3 className="font-sans text-lg font-light text-shaanti-800 group-hover:text-shaanti-600 transition-colors mb-1">
          {pro.name}
        </h3>

        {/* Bio */}
        <p className="text-xs font-body text-shaanti-400 mb-3 line-clamp-2 leading-relaxed">
          {pro.bio}
        </p>

        {/* Spécialités */}
        {specs.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {specs.map(s => (
              <span
                key={s}
                className="text-xs font-body px-2.5 py-0.5 rounded-full"
                style={{ backgroundColor: cat.bg, color: cat.color }}
              >
                {s.trim()}
              </span>
            ))}
          </div>
        )}

        {/* Lien */}
        <div
          className="flex items-center gap-1 text-xs font-body mt-1"
          style={{ color: cat.accent }}
        >
          Réserver <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
