import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Gift, Cake, Users, Percent, ArrowRight, Check } from 'lucide-react';
import { useContent } from '@/content/ContentProvider';

export function Offers() {
  const { content } = useContent();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const iconMap = {
    gift: Gift,
    cake: Cake,
    users: Users,
  } as const;

  const scrollToBooking = () => {
    const element = document.querySelector('#booking');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="offers"
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
            Акции и предложения
          </motion.span>
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6">
            СПЕЦИАЛЬНЫЕ{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              ПРЕДЛОЖЕНИЯ
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Подарите эмоции, отпразднуйте особенный день или сплотите команду 
            с нашими специальными программами.
          </p>
        </motion.div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {content.offers.map((offer, index) => {
            const Icon = iconMap[offer.iconKey];
            return (
            <motion.div
              key={offer.id}
              className={`relative p-8 rounded-2xl border ${
                offer.popular
                  ? 'bg-gradient-to-b from-purple-900/20 to-[#111] border-purple-500/30'
                  : 'bg-[#111] border-white/5'
              }`}
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.15 }}
            >
              {/* Popular Badge */}
              {offer.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-sm font-medium">
                    Популярное
                  </span>
                </div>
              )}

              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
                offer.popular ? 'bg-purple-500/20' : 'bg-white/5'
              }`}>
                <Icon className={`w-7 h-7 ${offer.popular ? 'text-purple-400' : 'text-gray-400'}`} />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold mb-3">{offer.title}</h3>
              <p className="text-gray-400 mb-6 text-sm leading-relaxed">{offer.description}</p>

              {/* Price */}
              <div className="mb-6">
                <span className="text-3xl font-bold">{offer.price}</span>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {offer.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                    <Check className={`w-4 h-4 ${offer.popular ? 'text-purple-400' : 'text-cyan-400'}`} />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <motion.button
                onClick={scrollToBooking}
                className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
                  offer.popular
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Подробнее
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          )})}
        </div>

        {/* Additional Info */}
        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {/* Promo Code */}
          <div className="p-8 rounded-2xl bg-gradient-to-br from-red-900/20 to-[#111] border border-red-500/20">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                <Percent className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Скидка 10% на дневные игры</h3>
                <p className="text-sm text-gray-400">При бронировании до 15:00</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm">
              Укажите промокод <span className="text-red-400 font-mono">DAY10</span> при бронировании 
              и получите скидку 10% на любой квест до 15:00.
            </p>
          </div>

          {/* Group Discount */}
          <div className="p-8 rounded-2xl bg-gradient-to-br from-cyan-900/20 to-[#111] border border-cyan-500/20">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Групповая скидка</h3>
                <p className="text-sm text-gray-400">При бронировании от 3 квестов</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm">
              Забронируйте 3 и более квеста одновременно и получите скидку 15% на каждый. 
              Идеально для больших компаний.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
