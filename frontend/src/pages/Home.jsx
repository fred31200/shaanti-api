import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Calendar, Users, Sparkles } from 'lucide-react';
import api from '../api';
import Mandala from '../components/Mandala';

const DISCIPLINES = [
  {
    id: 'yoga',
    label: 'Yoga',
    emoji: '🧘',
    desc: 'Postures, respiration et méditation pour retrouver équilibre et sérénité.',
    bg: '#F7F0E6',
    border: '#DCC5A8',
    accent: '#A67C52',
  },
  {
    id: 'danse',
    label: 'Danse',
    emoji: '💃',
    desc: 'Salsa, bachata, danses brésiliennes — libérez votre corps et votre féminité.',
    bg: '#F2EBF7',
    border: '#C9B0D9',
    accent: '#7B52A6',
  },
  {
    id: 'pilates',
    label: 'Pilates',
    emoji: '🤸',
    desc: 'Renforcement profond, posture parfaite et souplesse avec la méthode Pilates.',
    bg: '#EBF2F7',
    border: '#A8C4D9',
    accent: '#3A6B8A',
  },
];

const STATS = [
  { value: '8',  label: 'Coachs certifiés',  icon: <Users className="w-5 h-5" /> },
  { value: '3',  label: 'Disciplines',        icon: <Sparkles className="w-5 h-5" /> },
  { value: '25+', label: 'Cours par semaine', icon: <Calendar className="w-5 h-5" /> },
  { value: '⭐ 4.8', label: 'Note moyenne',   icon: <Star className="w-5 h-5" /> },
];

const CAT_CONFIG = {
  yoga:    { bg: '#F7F0E6', color: '#A67C52' },
  danse:   { bg: '#F2EBF7', color: '#7B52A6' },
  pilates: { bg: '#EBF2F7', color: '#3A6B8A' },
};

export default function Home() {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);

  /* Récupère un coach par discipline pour la section "Nos coachs" */
  useEffect(() => {
    api.get('/professionals').then(({ data }) => {
      const yoga    = data.find(p => p.category === 'yoga');
      const danse   = data.find(p => p.category === 'danse');
      const pilates = data.find(p => p.category === 'pilates');
      setFeatured([yoga, danse, pilates].filter(Boolean));
    }).catch(() => {});
  }, []);

  return (
    <div style={{ backgroundColor: '#FDFAF5' }}>

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section
        style={{ backgroundColor: '#F7F0E6' }}
        className="relative overflow-hidden"
      >
        {/* Mandalas décoratifs d'arrière-plan */}
        <div className="absolute -top-20 -right-20 pointer-events-none select-none">
          <Mandala size={420} color="#A67C52" opacity={0.09} spin />
        </div>
        <div className="absolute -bottom-32 -left-32 pointer-events-none select-none">
          <Mandala size={340} color="#A67C52" opacity={0.06} spin reverse />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none opacity-[0.03]">
          <Mandala size={700} color="#6F4E32" opacity={1} />
        </div>

        <div className="max-w-5xl mx-auto px-6 py-24 md:py-36 relative">
          <div className="md:grid md:grid-cols-2 md:gap-12 md:items-center">

            {/* Texte hero */}
            <div className="text-center md:text-left">
              <p className="font-body text-xs uppercase tracking-[0.35em] text-shaanti-500 mb-5">
                Centre de bien-être · L'Union
              </p>
              <h1 className="font-sans text-5xl md:text-6xl lg:text-7xl font-light text-shaanti-800 mb-6 leading-[1.1]">
                Un espace pour<br />
                <em className="italic text-shaanti-600">prendre soin<br />de soi</em>
              </h1>
              <p className="font-body text-base text-shaanti-500 mb-10 max-w-sm mx-auto md:mx-0 leading-relaxed">
                Yoga, danse et pilates dans un cadre apaisant et chaleureux,
                au cœur d'un espace entièrement dédié à votre bien-être.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <button
                  onClick={() => navigate('/cours')}
                  className="btn-primary flex items-center gap-2 justify-center"
                >
                  Voir les cours <ArrowRight className="w-4 h-4" />
                </button>
                <Link to="/salle" className="btn-secondary flex items-center gap-2 justify-center">
                  Louer la salle
                </Link>
              </div>
            </div>

            {/* Photo du centre */}
            <div className="hidden md:block relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl" style={{ aspectRatio: '1/1' }}>
                <img
                  src="https://shaanti.fr/wp-content/uploads/2025/07/Photo_Centre_3-1024x1024.png"
                  alt="Salle du centre Shaanti"
                  className="w-full h-full object-cover"
                  onError={e => {
                    e.target.parentNode.style.backgroundColor = '#DCC5A8';
                    e.target.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-shaanti-800/20 to-transparent" />
              </div>
              {/* Mandala flottant sur la photo */}
              <div className="absolute -bottom-8 -right-8 pointer-events-none">
                <Mandala size={120} color="#A67C52" opacity={0.25} spin />
              </div>
              {/* Badge "Centre Shaanti" */}
              <div
                className="absolute -top-4 -left-4 font-body text-xs px-4 py-2 rounded-full shadow-lg"
                style={{ backgroundColor: '#FDFAF5', color: '#6F4E32', border: '1px solid #DCC5A8' }}
              >
                ✦ Centre Shaanti
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          STATS
      ══════════════════════════════════════ */}
      <section style={{ backgroundColor: '#F2EBE0' }} className="py-8">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map(s => (
              <div key={s.label} className="text-center py-4">
                <div className="flex justify-center text-shaanti-500 mb-1">{s.icon}</div>
                <div className="font-sans text-2xl font-light text-shaanti-800">{s.value}</div>
                <div className="font-body text-xs text-shaanti-400 uppercase tracking-wider mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          NOS DISCIPLINES
      ══════════════════════════════════════ */}
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
              className="border rounded-3xl p-8 text-center cursor-pointer hover:-translate-y-2 hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
            >
              {/* Petit mandala watermark dans la carte */}
              <div className="absolute -bottom-6 -right-6 pointer-events-none group-hover:rotate-12 transition-transform duration-700">
                <Mandala size={100} color={d.accent} opacity={0.12} />
              </div>
              <div className="text-5xl mb-5 relative">{d.emoji}</div>
              <h3 className="font-sans text-xl font-light text-shaanti-800 mb-3">{d.label}</h3>
              <p className="font-body text-sm text-shaanti-500 leading-relaxed mb-5">{d.desc}</p>
              <div
                className="inline-flex items-center gap-1.5 text-xs font-body uppercase tracking-wider"
                style={{ color: d.accent }}
              >
                Découvrir <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          NOS COACHS (dynamique)
      ══════════════════════════════════════ */}
      {featured.length > 0 && (
        <section
          style={{ backgroundColor: '#F7F0E6' }}
          className="py-20 relative overflow-hidden"
        >
          {/* Mandala déco gauche */}
          <div className="absolute -left-24 top-1/2 -translate-y-1/2 pointer-events-none select-none">
            <Mandala size={300} color="#A67C52" opacity={0.07} spin />
          </div>
          {/* Mandala déco droite */}
          <div className="absolute -right-24 top-8 pointer-events-none select-none">
            <Mandala size={240} color="#A67C52" opacity={0.05} spin reverse />
          </div>

          <div className="max-w-5xl mx-auto px-6 relative">
            <div className="text-center mb-12">
              <p className="font-body text-xs uppercase tracking-[0.3em] text-shaanti-400 mb-3">L'équipe</p>
              <h2 className="section-title">Nos coachs</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {featured.map(pro => {
                const cat = CAT_CONFIG[pro.category] || CAT_CONFIG.yoga;
                return (
                  <Link
                    key={pro.id}
                    to={`/cours/${pro.id}`}
                    className="card group hover:-translate-y-1 hover:shadow-xl transition-all duration-300 overflow-hidden block"
                  >
                    {/* Photo ou fallback coloré */}
                    <div className="h-52 relative overflow-hidden">
                      {pro.avatar ? (
                        <img
                          src={pro.avatar}
                          alt={pro.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={e => {
                            e.target.style.display = 'none';
                            e.target.parentNode.style.backgroundColor = cat.bg;
                          }}
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center text-5xl"
                          style={{ backgroundColor: cat.bg }}
                        >
                          {pro.category === 'yoga' ? '🧘' : pro.category === 'danse' ? '💃' : '🤸'}
                        </div>
                      )}
                      {/* Dégradé noir bas */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                      {/* Nom + discipline sur la photo */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <div
                          className="inline-block font-body text-xs px-2.5 py-0.5 rounded-full mb-1.5 uppercase tracking-wider"
                          style={{ backgroundColor: cat.color + '33', color: 'white', border: `1px solid ${cat.color}66` }}
                        >
                          {pro.category}
                        </div>
                        <p className="font-sans text-white text-xl font-light">{pro.name}</p>
                      </div>
                    </div>
                    {/* Bio */}
                    <div className="p-5">
                      <p className="font-body text-xs text-shaanti-500 leading-relaxed line-clamp-3">
                        {pro.bio}
                      </p>
                      <div className="mt-4 flex items-center gap-1.5 text-xs font-body" style={{ color: cat.color }}>
                        Réserver un cours <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="text-center mt-10">
              <Link to="/cours" className="btn-primary inline-flex items-center gap-2">
                Voir tous les cours <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════
          LA SALLE
      ══════════════════════════════════════ */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="font-body text-xs uppercase tracking-[0.3em] text-shaanti-400 mb-3">Location d'espace</p>
            <h2 className="section-title mb-5">
              Notre salle<br />
              <em className="italic text-shaanti-600">à louer</em>
            </h2>
            <p className="font-body text-sm text-shaanti-500 leading-relaxed mb-6">
              Notre salle lumineuse et équipée est disponible à la location pour vos cours privés,
              ateliers, répétitions ou événements bien-être. Un espace polyvalent dans une
              atmosphère calme et chaleureuse.
            </p>
            <ul className="space-y-2 mb-8">
              {[
                'Parquet bois, miroirs, barres',
                'Sono intégrée (Bluetooth)',
                'Vestiaires et douches',
                'Capacité jusqu\'à 20 personnes',
              ].map(item => (
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

          {/* Photo du centre ou fallback mandala */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-lg" style={{ aspectRatio: '4/3' }}>
              <img
                src="https://shaanti.fr/wp-content/uploads/2025/07/Photo_Centre_3-1024x1024.png"
                alt="Salle du centre Shaanti"
                className="w-full h-full object-cover"
                onError={e => {
                  e.target.style.display = 'none';
                  e.target.parentNode.style.backgroundColor = '#F7F0E6';
                  e.target.parentNode.style.display = 'flex';
                  e.target.parentNode.style.alignItems = 'center';
                  e.target.parentNode.style.justifyContent = 'center';
                }}
              />
            </div>
            {/* Prix flottant */}
            <div
              className="absolute -bottom-4 -left-4 font-sans text-shaanti-800 px-5 py-3 rounded-2xl shadow-lg"
              style={{ backgroundColor: '#FDFAF5', border: '1px solid #EDE0CC' }}
            >
              <span className="text-2xl font-light">25€</span>
              <span className="font-body text-xs text-shaanti-400 ml-1">/ heure</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SÉPARATEUR MANDALA
      ══════════════════════════════════════ */}
      <div className="flex items-center justify-center py-6 gap-6 opacity-30">
        <div style={{ height: '1px', width: '80px', backgroundColor: '#DCC5A8' }} />
        <Mandala size={36} color="#A67C52" opacity={1} />
        <div style={{ height: '1px', width: '80px', backgroundColor: '#DCC5A8' }} />
      </div>

      {/* ══════════════════════════════════════
          POURQUOI SHAANTI
      ══════════════════════════════════════ */}
      <section style={{ backgroundColor: '#F7F0E6' }} className="py-20 relative overflow-hidden">
        {/* Grand mandala centré très subtil */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <Mandala size={600} color="#A67C52" opacity={0.035} spin />
        </div>

        <div className="max-w-5xl mx-auto px-6 relative">
          <div className="text-center mb-12">
            <p className="font-body text-xs uppercase tracking-[0.3em] text-shaanti-400 mb-3">Notre engagement</p>
            <h2 className="section-title">Pourquoi choisir Shaanti ?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Calendar className="w-7 h-7 text-shaanti-500" />,
                title: 'Réservation simple',
                desc: 'Réservez votre cours en quelques secondes, 24h/24, depuis votre téléphone ou ordinateur.',
              },
              {
                icon: <Star className="w-7 h-7 text-shaanti-500" />,
                title: 'Instructeurs passionnés',
                desc: 'Des professeurs certifiés, bienveillants et attentifs, qui s\'adaptent à chaque pratiquant.',
              },
              {
                icon: <Shield className="w-7 h-7 text-shaanti-500" />,
                title: 'Espace apaisant',
                desc: 'Un cadre pensé pour la sérénité — lumière naturelle, matériaux doux, ambiance chaleureuse.',
              },
            ].map(item => (
              <div
                key={item.title}
                className="text-center p-6 rounded-2xl hover:-translate-y-1 transition-transform duration-200"
                style={{ backgroundColor: 'rgba(253,250,245,0.6)' }}
              >
                <div className="flex justify-center mb-4">{item.icon}</div>
                <h3 className="font-sans text-lg font-light text-shaanti-800 mb-2">{item.title}</h3>
                <p className="font-body text-sm text-shaanti-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA FINAL
      ══════════════════════════════════════ */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center relative">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.04]">
          <Mandala size={400} color="#A67C52" opacity={1} spin reverse />
        </div>
        <p className="font-body text-xs uppercase tracking-[0.35em] text-shaanti-400 mb-4">Commencez aujourd'hui</p>
        <h2 className="font-sans text-4xl md:text-5xl font-light text-shaanti-800 mb-6 leading-tight">
          Votre premier cours<br />
          <em className="italic text-shaanti-600">vous attend</em>
        </h2>
        <p className="font-body text-sm text-shaanti-500 mb-8 max-w-md mx-auto leading-relaxed">
          Inscrivez-vous en ligne, choisissez votre activité et rejoignez une communauté
          bienveillante au centre Shaanti de L'Union.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/register" className="btn-primary flex items-center gap-2 justify-center">
            Créer mon compte <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/cours" className="btn-secondary flex items-center gap-2 justify-center">
            Explorer les cours
          </Link>
        </div>
      </section>

    </div>
  );
}
