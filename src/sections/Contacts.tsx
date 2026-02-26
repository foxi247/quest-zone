import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin, Phone, Clock, CreditCard, Car, Wifi, Calendar, Baby, Ban, AlertCircle } from 'lucide-react';
import { useContent } from '@/content/ContentProvider';

export function Contacts() {
  const { content } = useContent();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const featureIcons = [CreditCard, Car, Wifi, Calendar, Baby, CreditCard, Baby, MapPin];
  const features = content.siteSettings.features.map((label, index) => ({
    icon: featureIcons[index % featureIcons.length],
    label,
  }));

  return (
    <section
      ref={sectionRef}
      id="contacts"
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
            Контакты
          </motion.span>
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6">
            КАК НАС{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              НАЙТИ
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Address Card */}
            <div className="p-8 rounded-2xl bg-[#111] border border-white/5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Адрес</h3>
                  <p className="text-gray-300 mb-2">{content.siteSettings.address}</p>
                  <p className="text-sm text-gray-500 mb-4">Этаж: {content.siteSettings.floor}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 text-xs rounded-full bg-white/5 text-gray-400">
                      {content.siteSettings.landmarkPrimary}
                    </span>
                    <span className="px-3 py-1 text-xs rounded-full bg-white/5 text-gray-400">
                      {content.siteSettings.landmarkSecondary}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Phone & Hours */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-[#111] border border-white/5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-green-400" />
                  </div>
                  <h3 className="font-bold">Телефон</h3>
                </div>
                <a href={`tel:${content.siteSettings.phone}`} className="text-xl text-white hover:text-cyan-400 transition-colors">
                  {content.siteSettings.phoneDisplay}
                </a>
              </div>

              <div className="p-6 rounded-2xl bg-[#111] border border-white/5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-yellow-400" />
                  </div>
                  <h3 className="font-bold">Режим работы</h3>
                </div>
                <p className="text-gray-300">{content.siteSettings.workHoursLabel}</p>
                <p className="text-xl text-white">{content.siteSettings.workHours}</p>
              </div>
            </div>

            {/* Features */}
            <div className="p-6 rounded-2xl bg-[#111] border border-white/5">
              <h3 className="font-bold mb-4">Особенности</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {features.map((feature) => (
                  <div key={feature.label} className="flex flex-col items-center text-center p-3 rounded-lg bg-white/5">
                    <feature.icon className="w-5 h-5 text-cyan-400 mb-2" />
                    <span className="text-xs text-gray-400">{feature.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Methods */}
            <div className="p-6 rounded-2xl bg-[#111] border border-white/5">
              <h3 className="font-bold mb-4">Способы оплаты</h3>
              <div className="flex flex-wrap gap-2">
                {content.siteSettings.paymentMethods.map((method) => (
                  <span
                    key={method}
                    className="px-3 py-1 text-sm rounded-full bg-white/5 text-gray-300"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>

            {/* Important Notice */}
            <div className="p-6 rounded-2xl bg-red-900/10 border border-red-500/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-red-400 mb-2">Важно</h3>
                  <div className="space-y-2 text-sm text-gray-300">
                    <p className="flex items-center gap-2">
                      <Ban className="w-4 h-4 text-red-400" />
                      Посещение с животными запрещено
                    </p>
                    <p className="flex items-center gap-2">
                      <Ban className="w-4 h-4 text-red-400" />
                      Доступность на инвалидной коляске: недоступно
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Map */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="sticky top-24">
              <div className="p-2 rounded-2xl bg-[#111] border border-white/5">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#1a1a1a]">
                  {/* Yandex Map Embed */}
                  <iframe
                    src={content.siteSettings.mapEmbedUrl}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allowFullScreen
                    className="absolute inset-0 grayscale opacity-80"
                    style={{ filter: 'grayscale(100%) invert(90%)' }}
                  />
                  
                  {/* Overlay with location info */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-black/80 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">QZ</span>
                      </div>
                      <div>
                        <p className="font-semibold">Quest Zone</p>
                        <p className="text-sm text-gray-400">{content.siteSettings.addressShort}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <motion.a
                  href={content.siteSettings.yandexOrgUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl bg-[#111] border border-white/5 text-center hover:bg-white/5 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MapPin className="w-5 h-5 mx-auto mb-2 text-cyan-400" />
                  <span className="text-sm">Построить маршрут</span>
                </motion.a>
                <motion.a
                  href={`tel:${content.siteSettings.phone}`}
                  className="p-4 rounded-xl bg-[#111] border border-white/5 text-center hover:bg-white/5 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Phone className="w-5 h-5 mx-auto mb-2 text-green-400" />
                  <span className="text-sm">Позвонить</span>
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
