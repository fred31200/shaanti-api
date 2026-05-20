import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Calendar } from 'lucide-react';

const DISCIPLINES = [
  {
    id: 'yoga',
    label: 'Yoga',
    emoji: '🧘',
    desc: 'Retrouvez l\'équilibre corps et esprit à travers des séances adaptées à tous les niveaux.',
    bg: '#F7F0E6',
    border: '#DCC5A8',
  },
  {
    id: 'danse',
    label: 'Danse',
    emoji: '💃',
    desc: 'Exprimez-vous librement avec nos cours de danse contemporaine et moderne.',
    bg: '#F2EBF7',
    border: '#C9B0D9',
  },
  {
    id: 'pilates',
    label: 'Pilates',
    emoji: '🤸',
    desc: 'Renforcez votre centre et améliorez votre posture avec la méthode Pilates.',
    bg: '#EBF2F7',
    border: '#A8C4D9',
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: '#FDFAF5' }}>

      {/* Hero */}
      <section style={{ backgroundColor: '#F7F0E6' }} className="relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 py-24 md:py-32 text-center">
          <p className="font-body text-xs uppercase tracking-[0.3em] text-shaanti-500 mb-6">
            Centre de bien-être
          </p>
          <h1 className="font-sans text-5xl md:text-6xl lg:text-7xl font-light text-shaanti-800 mb-6 leading-tight">
            Un espace pour<br />
            <em className="italic text-shaanti-600">prendre soin de soi</em>
          </h1>
          <p className="font-body text-base text-shaanti-500 mb-10 max-w-lg mx-auto leading-relaxed">
            Yoga, danse et pilates dans un cadre apaisant et chaleureux, au cœur d'un espace entièrement dédié à votre bien-être.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => navigate('/cours')} className="btn-primary flex items-center gap-2 justify-center">
              Voir les cours <ArrowRight className="w-4 h-4" />
            </button>
            <Link to="/salle" className="btn-secondary flex items-center gap-2 justify-center">
              Louer la salle
            </Link>
          </div>
        </div>
        {/* Décoration */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #DCC5A8, transparent)', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #C4A07A, transparent)', transform: 'translate(-30%, 30%)' }} />
      </section>

      {/* Nos disciplines */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="font-body text-xs uppercase tracking-[0.3em] text-shaanti-400 mb-3">Ce que nous proposons</p>
          <h2 className="section-title">Nos disciplines</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {DISCIPLINES.map(d => (
            <div
              key={d.id}
              onClick={() => navigate(`/cours?category=${d.id}`)}
              style={{ backgroundColor: d.bg, borderColor: d.border }}
              className="border rounded-2xl p-8 text-center cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all duration-200"
            >
              <div className="text-5xl mb-5">{d.emoji}</div>
              <h3 className="font-sans text-xl font-light text-shaanti-800 mb-3">{d.label}</h3>
              <p className="font-body text-sm text-shaanti-500 leading-relaxed">{d.desc}</p>
              <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-body text-shaanti-600 uppercase tracking-wider">
                Découvrir <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Séparateur décoratif */}
      <div className="max-w-5xl mx-auto px-6">
        <div style={{ borderTop: '1px solid #EDE0CC' }} />
      </div>

      {/* La salle */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="font-body text-xs uppercase tracking-[0.3em] text-shaanti-400 mb-3">Location d'espace</p>
            <h2 className="section-title mb-5">Notre salle<br /><em className="italic text-shaanti-600">à louer</em></h2>
            <p className="font-body text-sm text-shaanti-500 leading-relaxed mb-6">
              Notre salle lumineuse et équipée est disponible à la location pour vos cours privés,
              ateliers, répétitions ou événements bien-être. Un espace polyvalent dans une atmosphère calme et chaleureuse.
            </p>
            <ul className="space-y-2 mb-8">
              {['Parquet bois, miroirs, barres', 'Sono intégrée', 'Vestiaires et douches', 'Capacité jusqu\'à 20 personnes'].map(item => (
                <li key={item} className="flex items-center gap-2 font-body text-sm text-shaanti-600">
                  <span style={{ backgroundColor: '#DCC5A8' }} className="w-1.5 h-1.5 rounded-full flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/salle" className="btn-primary inline-flex items-center gap-2">
              Réserver la salle <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div style={{ backgroundColor: '#F7F0E6', borderColor: '#EDE0CC' }}
            className="rounded-3xl h-72 flex items-center justify-center border text-7xl">
            🏛️
          </div>
        </div>
      </section>

      {/* Pourquoi Shaanti */}
      <section style={{ backgroundColor: '#F7F0E6' }} className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="font-body text-xs uppercase tracking-[0.3em] text-shaanti-400 mb-3">Notre engagement</p>
            <h2 className="section-title">Pourquoi choisir Shaanti ?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Calendar className="w-7 h-7 text-shaanti-500" />, title: 'Réservation simple', desc: 'Réservez votre cours en quelques secondes, à toute heure du jour.' },
              { icon: <Star className="w-7 h-7 text-shaanti-500" />, title: 'Instructeurs passionnés', desc: 'Des professeurs certifiés et bienveillants pour vous accompagner.' },
              { icon: <Shield className="w-7 h-7 text-shaanti-500" />, title: 'Espace apaisant', desc: 'Un cadre pensé pour la sérénité, la chaleur et le bien-être.' },
            ].map(item => (
              <div key={item.title} className="text-center">
                <div className="flex justify-center mb-4">{item.icon}</div>
                <h3 className="font-sans text-lg font-light text-shaanti-800 mb-2">{item.title}</h3>
                <p className="font-body text-sm text-shaanti-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
