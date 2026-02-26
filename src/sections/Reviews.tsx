import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';

interface Review {
  id: number;
  name: string;
  date: string;
  rating: number;
  text: string;
  quest: string;
  hasReply?: boolean;
  reply?: {
    text: string;
    date: string;
  };
}

const highlightedReviews: Review[] = [
  {
    id: 1,
    name: 'Магомед Магомедов',
    date: '15 сентября 2025',
    rating: 5,
    text: 'Выбрали "Пятница 13", взрослые и дети 13/12/8 — очень атмосферно, полное погружение, время пролетело, хотят вернуться на сложнее.',
    quest: 'Пятница 13',
  },
  {
    id: 2,
    name: 'Гамид Г.',
    date: '12 мая 2025',
    rating: 5,
    text: 'Квест с Джейсоном Вурхизом — "бомба", актёр на уровне, держали в сюжете, попали на акцию +20 минут, но не успели спасти жертву.',
    quest: 'Пятница 13',
  },
  {
    id: 3,
    name: 'Rustam D.',
    date: '8 мая 2025',
    rating: 5,
    text: 'День рождения сына, дети в восторге, актёры поздравили, устроили праздник. Спасибо за внимание к детям!',
    quest: 'Паразиты',
    hasReply: true,
    reply: {
      text: 'Спасибо, важно чтобы юным гостям было безопасно, ждём снова!',
      date: '24 мая 2025',
    },
  },
];

const otherReviews: Review[] = [
  { id: 4, name: 'Анна К.', date: '3 мая 2025', rating: 5, text: 'Отличный квест, очень атмосферно!', quest: 'Корпус "С"' },
  { id: 5, name: 'Иbrahim M.', date: '28 апреля 2025', rating: 4, text: 'Хорошо, но хотелось бы больше загадок', quest: 'Паразиты' },
  { id: 6, name: 'Семья Петровых', date: '20 апреля 2025', rating: 5, text: 'Прошли все три квеста, каждый уникален', quest: 'Все квесты' },
  { id: 7, name: 'Команда "Барс"', date: '15 апреля 2025', rating: 5, text: 'Корпоратив прошёл на ура!', quest: 'Пятница 13' },
];

function ReviewCard({ review, index }: { review: Review; index: number }) {
  return (
    <motion.div
      className="relative p-8 rounded-2xl bg-[#111] border border-white/5"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Quote className="absolute top-6 right-6 w-8 h-8 text-white/5" />
      
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="font-semibold text-white">{review.name}</h4>
          <span className="text-sm text-gray-500">{review.date}</span>
        </div>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
            />
          ))}
        </div>
      </div>

      {/* Quest Tag */}
      <div className="mb-4">
        <span className="inline-block px-3 py-1 text-xs rounded-full bg-white/5 text-gray-400">
          {review.quest}
        </span>
      </div>

      {/* Text */}
      <p className="text-gray-300 leading-relaxed mb-4">{review.text}</p>

      {/* Reply */}
      {review.hasReply && review.reply && (
        <div className="mt-4 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium text-cyan-400">Ответ Quest Zone</span>
            <span className="text-xs text-gray-500">{review.reply.date}</span>
          </div>
          <p className="text-sm text-gray-400 italic">{review.reply.text}</p>
        </div>
      )}
    </motion.div>
  );
}

export function Reviews() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [activeIndex, setActiveIndex] = useState(0);

  const nextReview = () => {
    setActiveIndex((prev) => (prev + 1) % highlightedReviews.length);
  };

  const prevReview = () => {
    setActiveIndex((prev) => (prev - 1 + highlightedReviews.length) % highlightedReviews.length);
  };

  return (
    <section
      ref={sectionRef}
      id="reviews"
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
            Отзывы
          </motion.span>
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6">
            ЧТО ГОВОРЯТ{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              ИГРОКИ
            </span>
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              <span className="text-2xl font-bold">4.6</span>
            </div>
            <span className="text-gray-500">•</span>
            <span className="text-gray-400">101 оценка</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-400">40 отзывов</span>
          </div>
        </motion.div>

        {/* Featured Review Carousel */}
        <motion.div
          className="relative mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#111] to-[#1a1a1a] border border-white/5 p-8 md:p-12">
            <Quote className="absolute top-8 right-8 w-16 h-16 text-white/5" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="max-w-3xl"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-xl font-bold">
                    {highlightedReviews[activeIndex].name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{highlightedReviews[activeIndex].name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span>{highlightedReviews[activeIndex].date}</span>
                      <span>•</span>
                      <span>{highlightedReviews[activeIndex].quest}</span>
                    </div>
                  </div>
                  <div className="ml-auto flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < highlightedReviews[activeIndex].rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                      />
                    ))}
                  </div>
                </div>
                
                <p className="text-xl md:text-2xl text-gray-200 leading-relaxed mb-8">
                  "{highlightedReviews[activeIndex].text}"
                </p>

                {highlightedReviews[activeIndex].hasReply && highlightedReviews[activeIndex].reply && (
                  <div className="p-6 rounded-xl bg-white/5 border-l-2 border-cyan-400">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageCircle className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm font-medium text-cyan-400">Ответ Quest Zone</span>
                      <span className="text-xs text-gray-500">{highlightedReviews[activeIndex].reply?.date}</span>
                    </div>
                    <p className="text-gray-400">{highlightedReviews[activeIndex].reply?.text}</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <div className="flex items-center gap-2">
                {highlightedReviews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === activeIndex ? 'w-8 bg-cyan-400' : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={prevReview}
                  className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextReview}
                  className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Other Reviews Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold mb-8">Другие отзывы</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {otherReviews.map((review, index) => (
              <ReviewCard key={review.id} review={review} index={index} />
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <p className="text-gray-400 mb-4">Прошли квест? Поделитесь впечатлениями!</p>
          <a
            href="https://yandex.ru/maps/org/quest_zone/..."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary rounded-lg inline-flex items-center gap-2"
          >
            Оставить отзыв
          </a>
        </motion.div>
      </div>
    </section>
  );
}
