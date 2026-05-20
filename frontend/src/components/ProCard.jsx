import { Link } from 'react-router-dom';
import { Star, MapPin, Clock } from 'lucide-react';

const CATEGORY_CONFIG = {
  yoga:    { label: 'Yoga',    emoji: '🧘', bg: '#F5EDE0', color: '#8B6340' },
  danse:   { label: 'Danse',   emoji: '💃', bg: '#F0EBF5', color: '#6B4E8A' },
  pilates: { label: 'Pilates', emoji: '🤸', bg: '#EBF0F5', color: '#3A6B8A' },
};

export default function CourseCard({ pro }) {
  const cat = CATEGORY_CONFIG[pro.category] || { label: pro.category, emoji: '✨', bg: '#F5EDE0', color: '#8B6340' };
  const specs = pro.specialties ? pro.specialties.split(',').slice(0, 3) : [];

  return (
    <Link to={`/cours/${pro.id}`} className="card hover:shadow-md hover:-translate-y-0.5 block group">
      {/* Bandeau catégorie */}
      <div style={{ backgroundColor: cat.bg }} className="h-32 flex items-center justify-center relative">
        <span className="text-5xl">{cat.emoji}</span>
        <div style={{ backgroundColor: cat.bg, color: cat.color, border: `1px solid ${cat.color}33` }}
          className="absolute bottom-3 left-4 text-xs font-body font-medium px-3 py-1 rounded-full tracking-wide">
          {cat.label}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-sans text-lg font-light text-shaanti-800 group-hover:text-shaanti-600 transition-colors">
            {pro.name}
          </h3>
          {pro.rating > 0 && (
            <div className="flex items-center gap-1 text-shaanti-500 text-xs font-body">
              <Star className="w-3.5 h-3.5 fill-shaanti-400 text-shaanti-400" />
              {pro.rating.toFixed(1)}
            </div>
          )}
        </div>

        <p className="text-xs font-body text-shaanti-400 mb-3 line-clamp-2 leading-relaxed">{pro.bio}</p>

        {specs.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {specs.map(s => (
              <span key={s} style={{ backgroundColor: '#F7F0E6', color: '#8B6340' }}
                className="text-xs font-body px-2.5 py-0.5 rounded-full">
                {s.trim()}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
