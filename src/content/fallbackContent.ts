export type QuestCategory = 'regular' | 'night' | 'advanced';
export type OfferIconKey = 'gift' | 'cake' | 'users';

export interface SiteSettings {
  id: string;
  phone: string;
  phoneDisplay: string;
  whatsappNumber: string;
  email: string;
  city: string;
  address: string;
  addressShort: string;
  floor: string;
  openHour: number;
  closeHour: number;
  openStatusText: string;
  closedStatusText: string;
  workHoursLabel: string;
  workHours: string;
  landmarkPrimary: string;
  landmarkSecondary: string;
  heroSubtitle: string;
  heroDescription: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  ratingLabel: string;
  ratingValue: number;
  ratingVotesLabel: string;
  ratingVotes: number;
  reviewsCount: number;
  galleryCountLabel: string;
  mapEmbedUrl: string;
  yandexOrgUrl: string;
  features: string[];
  paymentMethods: string[];
}

export interface QuestItem {
  id: string;
  category: QuestCategory;
  title: string;
  subtitle: string;
  price: number;
  duration: string;
  players: string;
  difficulty: number;
  description: string;
  image: string;
  tags: string[];
  sortOrder: number;
}

export interface GalleryItem {
  id: string;
  url: string;
  alt: string;
  category: string;
  sortOrder: number;
}

export interface ReviewReply {
  text: string;
  date: string;
}

export interface ReviewItem {
  id: string;
  name: string;
  date: string;
  rating: number;
  text: string;
  quest: string;
  pinned: boolean;
  reply?: ReviewReply;
  sortOrder: number;
}

export interface OfferItem {
  id: string;
  iconKey: OfferIconKey;
  title: string;
  description: string;
  price: string;
  features: string[];
  popular: boolean;
  sortOrder: number;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface FooterLinkGroup {
  title: string;
  links: NavItem[];
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface SiteContent {
  siteSettings: SiteSettings;
  navigation: {
    items: NavItem[];
  };
  quests: QuestItem[];
  gallery: GalleryItem[];
  reviews: ReviewItem[];
  offers: OfferItem[];
  booking: {
    timeSlots: string[];
    playerCounts: string[];
    faq: FaqItem[];
  };
  footer: {
    linkGroups: FooterLinkGroup[];
  };
}

export const fallbackSiteContent: SiteContent = {
  siteSettings: {
    id: 'default',
    phone: '+79898801694',
    phoneDisplay: '+7 (989) 880-16-94',
    whatsappNumber: '79898801694',
    email: 'info@questzone.ru',
    city: 'Махачкала',
    address: 'Махачкала, ул. Дахадаева, 4',
    addressShort: 'ул. Дахадаева, 4',
    floor: 'цокольный',
    openHour: 12,
    closeHour: 23,
    openStatusText: 'Открыто',
    closedStatusText: 'Закрыто до 12:00',
    workHoursLabel: 'Ежедневно',
    workHours: '12:00 — 23:00',
    landmarkPrimary: 'Кумыкский театр — 104 м',
    landmarkSecondary: 'Такси от 80 ₽',
    heroSubtitle: 'Квесты с актёрами в Махачкале',
    heroDescription:
      'Погрузитесь в мир кинематографического хоррора. Три уникальные локации. Максимальное напряжение.',
    heroPrimaryCta: 'Выбрать квест',
    heroSecondaryCta: 'Позвонить',
    ratingLabel: 'Рейтинг',
    ratingValue: 4.6,
    ratingVotesLabel: 'оценка',
    ratingVotes: 101,
    reviewsCount: 40,
    galleryCountLabel: '38 фото',
    mapEmbedUrl:
      'https://yandex.ru/map-widget/v1/?ll=47.5047%2C42.9823&z=16&pt=47.5047%2C42.9823%2Cpm2rdl',
    yandexOrgUrl: 'https://yandex.ru/maps/org/quest_zone/...',
    features: [
      'Оплата картой',
      'Парковка (бесплатная)',
      'Wi-Fi',
      'Предварительная запись',
      'Детский санузел',
      'Подарочный сертификат',
      'Для детей',
    ],
    paymentMethods: ['СБП', 'QR-код', 'Предоплата', 'Наличные', 'Банковский перевод', 'Карта'],
  },
  navigation: {
    items: [
      { label: 'Главная', href: '#home' },
      { label: 'Квесты', href: '#quests' },
      { label: 'Ночные игры', href: '#night-games' },
      { label: 'Отзывы', href: '#reviews' },
      { label: 'Акции', href: '#offers' },
      { label: 'Контакты', href: '#contacts' },
    ],
  },
  quests: [
    {
      id: 'quest_regular_1',
      category: 'regular',
      title: 'Пятница 13',
      subtitle: 'Логово маньяка',
      price: 4000,
      duration: '1 час',
      players: '2-6 чел',
      difficulty: 4,
      description:
        'Вы в логове маньяка Джейсона Вурхиза. Нужно добраться до последней комнаты и спасти жертву. Времени мало — он уже идёт за вами.',
      image: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=800&q=80',
      tags: ['С актёром', 'По фильму', '18+'],
      sortOrder: 1,
    },
    {
      id: 'quest_regular_2',
      category: 'regular',
      title: 'Корпус "С"',
      subtitle: 'Психиатрическая больница',
      price: 4000,
      duration: '1 час',
      players: '2-6 чел',
      difficulty: 5,
      description:
        'Команда репортёров под видом пациентов. Цель — найти доказательства жестоких экспериментов. Но всё сложнее, чем кажется.',
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80',
      tags: ['С актёром', 'Психологический', '16+'],
      sortOrder: 2,
    },
    {
      id: 'quest_regular_3',
      category: 'regular',
      title: 'Паразиты',
      subtitle: 'Квартира 666',
      price: 4000,
      duration: '1 час',
      players: '2-5 чел',
      difficulty: 3,
      description:
        'Заброшенная квартира. Алекс и дочь Мия. Нужно найти 3 газовых вентиля и установить правильно, чтобы прекратить страдания.',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      tags: ['Для новичков', 'Загадки', '14+'],
      sortOrder: 3,
    },
    {
      id: 'quest_night_1',
      category: 'night',
      title: 'Пятница 13',
      subtitle: 'Ночная игра',
      price: 5000,
      duration: '1 час',
      players: '2-6 чел',
      difficulty: 4,
      description: 'Ночью страх многократно усиливается. Тишина, темнота, и Джейсон совсем рядом.',
      image: 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?w=800&q=80',
      tags: ['Night Mode'],
      sortOrder: 4,
    },
    {
      id: 'quest_night_2',
      category: 'night',
      title: 'Корпус "С"',
      subtitle: 'Ночная игра',
      price: 5000,
      duration: '1 час',
      players: '2-6 чел',
      difficulty: 5,
      description:
        'Психиатрическая больница после заката. Звуки становятся громче, тени — длиннее.',
      image: 'https://images.unsplash.com/photo-1499364615650-ec38552f4f34?w=800&q=80',
      tags: ['Night Mode'],
      sortOrder: 5,
    },
    {
      id: 'quest_night_3',
      category: 'night',
      title: 'Паразиты',
      subtitle: 'Ночная игра',
      price: 5000,
      duration: '1 час',
      players: '2-5 чел',
      difficulty: 3,
      description:
        'Квартира 666 в ночи. Газовые вентили скрываются в темноте, как и другие тайны.',
      image: 'https://images.unsplash.com/photo-1505506874110-6a7a69069a08?w=800&q=80',
      tags: ['Night Mode'],
      sortOrder: 6,
    },
    {
      id: 'quest_advanced_1',
      category: 'advanced',
      title: 'Пятница 13',
      subtitle: 'Продвинутая версия',
      price: 6000,
      duration: '1ч 30м',
      players: '2-6 чел',
      difficulty: 5,
      description:
        'Для тех, кто хочет максимального погружения: расширенная локация и более плотный сюжет.',
      image: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=800&q=80',
      tags: ['Продвинутая'],
      sortOrder: 7,
    },
    {
      id: 'quest_advanced_2',
      category: 'advanced',
      title: 'Корпус "С"',
      subtitle: 'Продвинутая версия',
      price: 6000,
      duration: '1ч 30м',
      players: '2-6 чел',
      difficulty: 5,
      description:
        'Больше загадок и дополнительные сцены для команд, готовых к более сложному прохождению.',
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80',
      tags: ['Продвинутая'],
      sortOrder: 8,
    },
    {
      id: 'quest_advanced_3',
      category: 'advanced',
      title: 'Паразиты',
      subtitle: 'Продвинутая версия',
      price: 6000,
      duration: '1ч 30м',
      players: '2-5 чел',
      difficulty: 4,
      description:
        'Усложнённые механики и дополнительная часть истории для более опытных игроков.',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      tags: ['Продвинутая'],
      sortOrder: 9,
    },
  ],
  gallery: [
    {
      id: 'gallery_1',
      url: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=1200&q=80',
      alt: 'Интерьер квеста Пятница 13',
      category: 'Интерьер',
      sortOrder: 1,
    },
    {
      id: 'gallery_2',
      url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=80',
      alt: 'Коридор психиатрической больницы',
      category: 'Корпус С',
      sortOrder: 2,
    },
    {
      id: 'gallery_3',
      url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
      alt: 'Заброшенная квартира',
      category: 'Паразиты',
      sortOrder: 3,
    },
    {
      id: 'gallery_4',
      url: 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?w=1200&q=80',
      alt: 'Атмосфера ночной игры',
      category: 'Ночные игры',
      sortOrder: 4,
    },
    {
      id: 'gallery_5',
      url: 'https://images.unsplash.com/photo-1499364615650-ec38552f4f34?w=1200&q=80',
      alt: 'Детали реквизита',
      category: 'Реквизит',
      sortOrder: 5,
    },
    {
      id: 'gallery_6',
      url: 'https://images.unsplash.com/photo-1505506874110-6a7a69069a08?w=1200&q=80',
      alt: 'Комната загадок',
      category: 'Интерьер',
      sortOrder: 6,
    },
  ],
  reviews: [
    {
      id: 'review_1',
      name: 'Магомед Магомедов',
      date: '15 сентября 2025',
      rating: 5,
      text: 'Выбрали "Пятница 13", взрослые и дети 13/12/8 — очень атмосферно, полное погружение, время пролетело, хотят вернуться на сложнее.',
      quest: 'Пятница 13',
      pinned: true,
      sortOrder: 1,
    },
    {
      id: 'review_2',
      name: 'Гамид Г.',
      date: '12 мая 2025',
      rating: 5,
      text: 'Квест с Джейсоном Вурхизом — "бомба", актёр на уровне, держали в сюжете, попали на акцию +20 минут, но не успели спасти жертву.',
      quest: 'Пятница 13',
      pinned: true,
      sortOrder: 2,
    },
    {
      id: 'review_3',
      name: 'Rustam D.',
      date: '8 мая 2025',
      rating: 5,
      text: 'День рождения сына, дети в восторге, актёры поздравили, устроили праздник. Спасибо за внимание к детям!',
      quest: 'Паразиты',
      pinned: true,
      reply: {
        text: 'Спасибо, важно чтобы юным гостям было безопасно, ждём снова!',
        date: '24 мая 2025',
      },
      sortOrder: 3,
    },
    {
      id: 'review_4',
      name: 'Анна К.',
      date: '3 мая 2025',
      rating: 5,
      text: 'Отличный квест, очень атмосферно!',
      quest: 'Корпус "С"',
      pinned: false,
      sortOrder: 4,
    },
    {
      id: 'review_5',
      name: 'Иbrahim M.',
      date: '28 апреля 2025',
      rating: 4,
      text: 'Хорошо, но хотелось бы больше загадок',
      quest: 'Паразиты',
      pinned: false,
      sortOrder: 5,
    },
    {
      id: 'review_6',
      name: 'Семья Петровых',
      date: '20 апреля 2025',
      rating: 5,
      text: 'Прошли все три квеста, каждый уникален',
      quest: 'Все квесты',
      pinned: false,
      sortOrder: 6,
    },
    {
      id: 'review_7',
      name: 'Команда "Барс"',
      date: '15 апреля 2025',
      rating: 5,
      text: 'Корпоратив прошёл на ура!',
      quest: 'Пятница 13',
      pinned: false,
      sortOrder: 7,
    },
  ],
  offers: [
    {
      id: 'offer_1',
      iconKey: 'gift',
      title: 'Подарочный сертификат',
      description:
        'Идеальный подарок для любителей острых ощущений. Сертификат на любую сумму или конкретный квест.',
      price: 'от 2 000 ₽',
      features: ['Срок действия — 6 месяцев', 'Можно использовать на любой квест', 'Именной сертификат'],
      popular: false,
      sortOrder: 1,
    },
    {
      id: 'offer_2',
      iconKey: 'cake',
      title: 'День рождения в Quest Zone',
      description: 'Отпразднуйте день рождения незабываемо! Специальные условия для именинников.',
      price: 'от 3 500 ₽',
      features: ['Скидка 10% имениннику', 'Фото на память', 'Поздравление от актёров', 'Чай/кофе для компании'],
      popular: true,
      sortOrder: 2,
    },
    {
      id: 'offer_3',
      iconKey: 'users',
      title: 'Корпоративный квест',
      description: 'Командообразование через страх. Идеально для сплочения коллектива.',
      price: 'от 15 000 ₽',
      features: ['До 20 участников', 'Несколько квестов параллельно', 'Фото/видео отчёт', 'Переговорная для дебрифинга'],
      popular: false,
      sortOrder: 3,
    },
  ],
  booking: {
    timeSlots: ['12:00', '13:30', '15:00', '16:30', '18:00', '19:30', '21:00', '22:30'],
    playerCounts: ['2', '3', '4', '5', '6'],
    faq: [
      {
        q: 'Можно ли с детьми?',
        a: 'Да, у нас есть квесты для детей от 8 лет. Дети младше 14 лет должны быть в сопровождении взрослых.',
      },
      {
        q: 'Нужна ли предварительная запись?',
        a: 'Да, обязательно. Запись принимается минимум за 2 часа до начала игры.',
      },
      {
        q: 'Какие способы оплаты?',
        a: 'Принимаем наличные, карты, СБП, QR-коды и банковские переводы.',
      },
      {
        q: 'Можно ли с животными?',
        a: 'К сожалению, нет. Посещение с животными запрещено.',
      },
      {
        q: 'Где вход?',
        a: 'Вход находится на цокольном этаже. Ориентир — Кумыкский театр (104 м).',
      },
      {
        q: 'Есть ли парковка?',
        a: 'Да, бесплатная парковка доступна для наших гостей.',
      },
    ],
  },
  footer: {
    linkGroups: [
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
    ],
  },
};

export function cloneFallbackContent(): SiteContent {
  return JSON.parse(JSON.stringify(fallbackSiteContent)) as SiteContent;
}
