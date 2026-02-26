import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Moon, Clock, Sparkles, ArrowRight } from 'lucide-react';

const nightGames = [
  {
    id: 1,
    title: 'Пятница 13',
    subtitle: 'Ночная игра',
    price: 5000,
    duration: '1 час',
    description: 'Ночью страх многократно усиливается. Тишина, темнота, и Джейсон совсем рядом.',
    image: 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?w=800&q=80',
  },
  {
    id: 2,
    title: 'Корпус "С"',
    subtitle: 'Ночная игра',
    price: 5000,
    duration: '1 час',
    description: 'Психиатрическая больница после заката. Звуки становятся громче, тени — длиннее.',
    image: 'https://images.unsplash.com/photo-1499364615650-ec38552f4f34?w=800&q=80',
  },
  {
    id: 3,
    title: 'Паразиты',
    subtitle: 'Ночная игра',
    price: 5000,
    duration: '1 час',
    description: 'Квартира 666 в ночи. Газовые вентили скрываются в темноте, как и другие тайны.',
    image: 'https://images.unsplash.com/photo-1505506874110-6a7a69069a08?w=800&q=80',
  },
];

export function NightGames() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  const scrollToBooking = () => {
    const element = document.querySelector('#booking');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="night-games"
      className="relative py-32 overflow-hidden"
    >
      {/* Background */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: backgroundY }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0d0d1a] to-[#0a0a0a]" />
        
        {/* Stars effect */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Moon glow */}
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-blue-500/10 blur-[100px]" />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
          >
            <Moon className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-300">Специальный режим</span>
          </motion.div>
          
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6">
            НОЧНЫЕ{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              ИГРЫ
            </span>
          </h2>
          
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            После заката квесты преображаются. Тишина, темнота, максимальная плотность страха. 
            Для тех, кто ищет настоящих острых ощущений.
          </p>
        </motion.div>

        {/* Night Games Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {nightGames.map((game, index) => (
            <motion.div
              key={game.id}
              className="group relative"
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              data-cursor="flashlight"
            >
              <div className="relative h-[500px] rounded-2xl overflow-hidden border border-white/5">
                {/* Background Image */}
                <motion.img
                  src={game.image}
                  alt={game.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.8 }}
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                
                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-blue-400" />
                      <span className="text-xs text-blue-400 uppercase tracking-wider">Night Mode</span>
                    </div>
                    
                    <h3 className="text-3xl font-bold mb-1">{game.title}</h3>
                    <p className="text-lg text-gray-400 mb-4">{game.subtitle}</p>
                    
                    <p className="text-sm text-gray-300 mb-6 line-clamp-2">
                      {game.description}
                    </p>
                    
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex items-center gap-1 text-sm text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{game.duration}</span>
                      </div>
                      <div className="w-1 h-1 bg-gray-600 rounded-full" />
                      <span className="text-2xl font-bold text-white">
                        {game.price.toLocaleString()} ₽
                      </span>
                    </div>
                    
                    <motion.button
                      onClick={scrollToBooking}
                      className="flex items-center gap-2 w-full justify-center py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium transition-colors group/btn"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Забронировать ночную игру
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </motion.button>
                  </motion.div>
                </div>

                {/* Hover border effect */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-500/30 transition-colors duration-500 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/20"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold mb-2">Ночные игры проходят с 21:00 до 23:00</h3>
              <p className="text-gray-400">
                Требуется предварительная запись минимум за 2 часа. 
                Количество мест ограничено.
              </p>
            </div>
            <motion.button
              onClick={scrollToBooking}
              className="btn-primary rounded-lg whitespace-nowrap"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Узнать расписание
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
