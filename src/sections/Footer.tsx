import { motion } from 'framer-motion';
import { Phone, MapPin, Instagram, MessageCircle, Mail } from 'lucide-react';

const footerLinks = [
  {
    title: 'Квесты',
    links: [
      { label: 'Пятница 13', href: '#quests' },
      { label: 'Корпус "С"', href: '#quests' },
      { label: 'Паразиты', href: '#quests' },
      { label: 'Ночные игры', href: '#night-games' },
    ],
  },
  {
    title: 'Информация',
    links: [
      { label: 'Правила', href: '#' },
      { label: 'FAQ', href: '#booking' },
      { label: 'Подарочные сертификаты', href: '#offers' },
      { label: 'Корпоративы', href: '#offers' },
    ],
  },
];

export function Footer() {
  const scrollToSection = (href: string) => {
    if (href === '#') return;
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative py-20 bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">QZ</span>
              </div>
              <div>
                <span className="text-xl font-bold tracking-wider">QUEST ZONE</span>
                <p className="text-xs text-gray-500">Квесты в Махачкале</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-6">
              Кинематографические квесты с актёрами. 
              Погрузитесь в мир настоящего хоррора.
            </p>
            <div className="flex items-center gap-3">
              <motion.a
                href="https://instagram.com/questzone"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Instagram className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="https://wa.me/79898801694"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <MessageCircle className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="mailto:info@questzone.ru"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail className="w-5 h-5" />
              </motion.a>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="font-semibold mb-4 text-white">{group.title}</h4>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection(link.href);
                      }}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Контакты</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:+79898801694"
                  className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">+7 (989) 880-16-94</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span className="text-sm">
                  Махачкала, ул. Дахадаева, 4
                  <br />
                  <span className="text-gray-500">Цокольный этаж</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © 2025 Quest Zone. Все права защищены.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">
              Политика конфиденциальности
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">
              Публичная оферта
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
