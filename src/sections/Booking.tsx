import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Calendar, Clock, Users, Phone, MessageCircle, Check, ChevronDown } from 'lucide-react';
import { useContent } from '@/content/ContentProvider';

export function Booking() {
  const { content } = useContent();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const bookingQuests = content.quests
    .filter((quest) => quest.category === 'regular' || quest.category === 'night')
    .map((quest) => ({
      id: quest.id,
      name: `${quest.title} — ${quest.subtitle}`,
      price: quest.price,
    }));
  
  const [formData, setFormData] = useState({
    quest: '',
    date: '',
    time: '',
    players: '',
    phone: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section
      ref={sectionRef}
      id="booking"
      className="relative py-32 bg-[#0a0a0a]"
    >
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
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
            Бронирование
          </motion.span>
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6">
            ЗАПИСАТЬСЯ{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">
              НА КВЕСТ
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Выберите квест, дату и время. Мы свяжемся с вами для подтверждения бронирования.
          </p>
        </motion.div>

        {/* Booking Form */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-[#111] to-[#1a1a1a] border border-white/5">
            {isSubmitted ? (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check className="w-10 h-10 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Заявка отправлена!</h3>
                <p className="text-gray-400">Мы свяжемся с вами в ближайшее время</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Quest Selection */}
                <div className="space-y-2">
                  <label className="text-sm text-gray-400 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Выберите квест
                  </label>
                  <div className="relative">
                    <select
                      value={formData.quest}
                      onChange={(e) => handleChange('quest', e.target.value)}
                      className="w-full p-4 rounded-xl bg-black/50 border border-white/10 text-white appearance-none focus:border-cyan-400 focus:outline-none transition-colors"
                      required
                    >
                      <option value="">Выберите квест...</option>
                      {bookingQuests.map((quest) => (
                        <option key={quest.id} value={quest.id}>
                          {quest.name} — {quest.price.toLocaleString()} ₽
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                  </div>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Дата
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleChange('date', e.target.value)}
                      className="w-full p-4 rounded-xl bg-black/50 border border-white/10 text-white focus:border-cyan-400 focus:outline-none transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Время
                    </label>
                    <div className="relative">
                      <select
                        value={formData.time}
                        onChange={(e) => handleChange('time', e.target.value)}
                        className="w-full p-4 rounded-xl bg-black/50 border border-white/10 text-white appearance-none focus:border-cyan-400 focus:outline-none transition-colors"
                        required
                      >
                        <option value="">Выберите время...</option>
                        {content.booking.timeSlots.map((time) => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Players & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Количество игроков
                    </label>
                    <div className="relative">
                      <select
                        value={formData.players}
                        onChange={(e) => handleChange('players', e.target.value)}
                        className="w-full p-4 rounded-xl bg-black/50 border border-white/10 text-white appearance-none focus:border-cyan-400 focus:outline-none transition-colors"
                        required
                      >
                        <option value="">Выберите...</option>
                        {content.booking.playerCounts.map((count) => (
                          <option key={count} value={count}>{count} чел</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Телефон
                    </label>
                    <input
                      type="tel"
                      placeholder="+7 (___) ___-__-__"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="w-full p-4 rounded-xl bg-black/50 border border-white/10 text-white placeholder-gray-600 focus:border-cyan-400 focus:outline-none transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold text-lg hover:from-red-500 hover:to-red-600 transition-all"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  Отправить заявку
                </motion.button>

                {/* Alternative Contact */}
                <div className="text-center pt-4 border-t border-white/5">
                  <p className="text-sm text-gray-500 mb-3">Или свяжитесь с нами напрямую</p>
                  <div className="flex items-center justify-center gap-4">
                    <motion.a
                      href={`https://wa.me/${content.siteSettings.whatsappNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </motion.a>
                    <motion.a
                      href={`tel:${content.siteSettings.phone}`}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Phone className="w-4 h-4" />
                      Позвонить
                    </motion.a>
                  </div>
                </div>
              </form>
            )}
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          className="mt-20"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold text-center mb-8">Частые вопросы</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.booking.faq.map((item, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-xl bg-[#111] border border-white/5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <h4 className="font-semibold mb-2 text-cyan-400">{item.q}</h4>
                <p className="text-sm text-gray-400">{item.a}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
