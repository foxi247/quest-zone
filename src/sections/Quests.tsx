import { useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Clock, Users, AlertTriangle, ArrowRight } from 'lucide-react';
import { useContent } from '@/content/ContentProvider';
import type { QuestItem } from '@/content/fallbackContent';

function QuestCard({ quest, index }: { quest: QuestItem; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-100px' });
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['8deg', '-8deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-8deg', '8deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const scrollToBooking = () => {
    const element = document.querySelector('#booking');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className="relative perspective-1000"
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      data-cursor="target"
    >
      <motion.div
        className="relative bg-[#111] rounded-2xl overflow-hidden border border-white/5 group"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        {/* Image */}
        <div className="relative h-64 overflow-hidden">
          <motion.img
            src={quest.image}
            alt={quest.title}
            className="w-full h-full object-cover"
            style={{
              transform: 'translateZ(50px)',
            }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />
          
          {/* Difficulty Badge */}
          <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/10">
            <AlertTriangle className="w-3 h-3 text-red-400" />
            <span className="text-xs text-white">Сложность {quest.difficulty}/5</span>
          </div>

          {/* Tags */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {quest.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs rounded-full bg-white/10 backdrop-blur-sm text-white/80"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6" style={{ transform: 'translateZ(30px)' }}>
          <h3 className="text-2xl font-bold mb-1">{quest.title}</h3>
          <p className="text-sm text-gray-400 mb-4">{quest.subtitle}</p>
          
          <p className="text-sm text-gray-300 mb-6 line-clamp-2">
            {quest.description}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-4 mb-6 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{quest.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{quest.players}</span>
            </div>
          </div>

          {/* Price & CTA */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-white">{quest.price.toLocaleString()} ₽</span>
              <span className="text-sm text-gray-500 ml-2">за команду</span>
            </div>
            <motion.button
              onClick={scrollToBooking}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors group/btn"
              whileHover={{ x: 4 }}
            >
              Забронировать
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </div>

        {/* Hover glow effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-red-500/5" />
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Quests() {
  const { content } = useContent();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const regularQuests = content.quests.filter((quest) => quest.category === 'regular');
  const advancedQuests = content.quests.filter((quest) => quest.category === 'advanced');

  return (
    <section
      ref={sectionRef}
      id="quests"
      className="relative py-32 bg-[#0a0a0a]"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.span
            className="inline-block text-xs tracking-[0.3em] text-cyan-400 uppercase mb-4"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
          >
            Наши квесты
          </motion.span>
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6">
            ВЫБЕРИ СВОЙ{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">
              СТРАХ
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Три уникальные локации, каждая со своей атмосферой и историей. 
            Все квесты с профессиональными актёрами.
          </p>
        </motion.div>

        {/* Quest Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularQuests.map((quest, index) => (
            <QuestCard key={quest.id} quest={quest} index={index} />
          ))}
        </div>

        {/* Extended Quests Info */}
        <motion.div
          className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Extended Duration Quests */}
          <div className="p-8 rounded-2xl bg-[#111] border border-white/5">
            <h3 className="text-2xl font-bold mb-4">Продвинутые — 90 минут</h3>
            <p className="text-gray-400 mb-6">
              Для тех, кто хочет максимального погружения. Расширенные локации, 
              больше загадок, глубже сюжет.
            </p>
            <div className="space-y-3">
              {advancedQuests.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-gray-300">
                    {item.title} — {item.duration}
                  </span>
                  <span className="font-semibold">{item.price.toLocaleString()} ₽</span>
                </div>
              ))}
            </div>
          </div>

          {/* Target Audience */}
          <div className="p-8 rounded-2xl bg-[#111] border border-white/5">
            <h3 className="text-2xl font-bold mb-4">Для кого наши квесты</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Для детей', desc: 'от 8 лет с родителями' },
                { label: 'Подростков', desc: 'от 14 лет' },
                { label: 'Взрослых', desc: '18+ экстрим' },
                { label: 'Компаний', desc: 'до 6 человек' },
                { label: 'С актёрами', desc: 'профессионалы' },
                { label: 'По фильмам', desc: 'кинематографичность' },
              ].map((item) => (
                <div key={item.label} className="p-4 rounded-lg bg-white/5">
                  <span className="block font-medium text-white mb-1">{item.label}</span>
                  <span className="text-xs text-gray-500">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
