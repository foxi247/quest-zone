import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
  cloneFallbackContent,
  type GalleryItem,
  type OfferItem,
  type QuestItem,
  type ReviewItem,
  type SiteContent,
  type SiteSettings,
} from './fallbackContent';

type ContentSource = 'fallback' | 'supabase';

interface ContentContextValue {
  content: SiteContent;
  isLoading: boolean;
  source: ContentSource;
  error: string | null;
  refresh: () => Promise<void>;
  saveSiteSettings: (settings: SiteSettings) => Promise<void>;
  saveQuests: (quests: QuestItem[]) => Promise<void>;
  saveGallery: (gallery: GalleryItem[]) => Promise<void>;
  saveReviews: (reviews: ReviewItem[]) => Promise<void>;
  saveOffers: (offers: OfferItem[]) => Promise<void>;
  uploadGalleryImage: (file: File) => Promise<string>;
}

const ContentContext = createContext<ContentContextValue | undefined>(undefined);

function asStringArray(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) return fallback;
  return value.map((item) => String(item));
}

function toNumber(value: unknown, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function assertSupabase() {
  if (!supabase) {
    throw new Error('Supabase не настроен: добавьте VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY');
  }
  return supabase;
}

function normalizeQuests(items: QuestItem[]): QuestItem[] {
  return [...items]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((item, index) => ({
      ...item,
      sortOrder: index + 1,
    }));
}

function normalizeGallery(items: GalleryItem[]): GalleryItem[] {
  return [...items]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((item, index) => ({
      ...item,
      sortOrder: index + 1,
    }));
}

function normalizeReviews(items: ReviewItem[]): ReviewItem[] {
  return [...items]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((item, index) => ({
      ...item,
      sortOrder: index + 1,
    }));
}

function normalizeOffers(items: OfferItem[]): OfferItem[] {
  return [...items]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((item, index) => ({
      ...item,
      sortOrder: index + 1,
    }));
}

function mapSiteSettings(row: Record<string, unknown>, fallback: SiteSettings): SiteSettings {
  return {
    ...fallback,
    id: String(row.id ?? fallback.id),
    phone: String(row.phone ?? fallback.phone),
    phoneDisplay: String(row.phone_display ?? fallback.phoneDisplay),
    whatsappNumber: String(row.whatsapp_number ?? fallback.whatsappNumber),
    email: String(row.email ?? fallback.email),
    city: String(row.city ?? fallback.city),
    address: String(row.address ?? fallback.address),
    addressShort: String(row.address_short ?? fallback.addressShort),
    floor: String(row.floor ?? fallback.floor),
    openHour: toNumber(row.open_hour, fallback.openHour),
    closeHour: toNumber(row.close_hour, fallback.closeHour),
    openStatusText: String(row.open_status_text ?? fallback.openStatusText),
    closedStatusText: String(row.closed_status_text ?? fallback.closedStatusText),
    workHoursLabel: String(row.work_hours_label ?? fallback.workHoursLabel),
    workHours: String(row.work_hours ?? fallback.workHours),
    landmarkPrimary: String(row.landmark_primary ?? fallback.landmarkPrimary),
    landmarkSecondary: String(row.landmark_secondary ?? fallback.landmarkSecondary),
    heroSubtitle: String(row.hero_subtitle ?? fallback.heroSubtitle),
    heroDescription: String(row.hero_description ?? fallback.heroDescription),
    heroPrimaryCta: String(row.hero_primary_cta ?? fallback.heroPrimaryCta),
    heroSecondaryCta: String(row.hero_secondary_cta ?? fallback.heroSecondaryCta),
    ratingLabel: String(row.rating_label ?? fallback.ratingLabel),
    ratingValue: toNumber(row.rating_value, fallback.ratingValue),
    ratingVotesLabel: String(row.rating_votes_label ?? fallback.ratingVotesLabel),
    ratingVotes: toNumber(row.rating_votes, fallback.ratingVotes),
    reviewsCount: toNumber(row.reviews_count, fallback.reviewsCount),
    galleryCountLabel: String(row.gallery_count_label ?? fallback.galleryCountLabel),
    mapEmbedUrl: String(row.map_embed_url ?? fallback.mapEmbedUrl),
    yandexOrgUrl: String(row.yandex_org_url ?? fallback.yandexOrgUrl),
    features: asStringArray(row.features, fallback.features),
    paymentMethods: asStringArray(row.payment_methods, fallback.paymentMethods),
  };
}

function mapQuest(row: Record<string, unknown>, fallback: QuestItem): QuestItem {
  return {
    ...fallback,
    id: String(row.id ?? fallback.id),
    category: (String(row.category ?? fallback.category) as QuestItem['category']) || fallback.category,
    title: String(row.title ?? fallback.title),
    subtitle: String(row.subtitle ?? fallback.subtitle),
    price: toNumber(row.price, fallback.price),
    duration: String(row.duration ?? fallback.duration),
    players: String(row.players ?? fallback.players),
    difficulty: toNumber(row.difficulty, fallback.difficulty),
    description: String(row.description ?? fallback.description),
    image: String(row.image ?? fallback.image),
    tags: asStringArray(row.tags, fallback.tags),
    sortOrder: toNumber(row.sort_order, fallback.sortOrder),
  };
}

function mapGallery(row: Record<string, unknown>, fallback: GalleryItem): GalleryItem {
  return {
    ...fallback,
    id: String(row.id ?? fallback.id),
    url: String(row.url ?? fallback.url),
    alt: String(row.alt ?? fallback.alt),
    category: String(row.category ?? fallback.category),
    sortOrder: toNumber(row.sort_order, fallback.sortOrder),
  };
}

function mapReview(row: Record<string, unknown>, fallback: ReviewItem): ReviewItem {
  const replyText = row.reply_text ? String(row.reply_text) : '';
  const replyDate = row.reply_date ? String(row.reply_date) : '';

  return {
    ...fallback,
    id: String(row.id ?? fallback.id),
    name: String(row.name ?? fallback.name),
    date: String(row.date_label ?? fallback.date),
    rating: Math.max(1, Math.min(5, toNumber(row.rating, fallback.rating))),
    text: String(row.text ?? fallback.text),
    quest: String(row.quest ?? fallback.quest),
    pinned: Boolean(row.pinned ?? fallback.pinned),
    reply:
      replyText.length > 0
        ? {
            text: replyText,
            date: replyDate || fallback.reply?.date || fallback.date,
          }
        : undefined,
    sortOrder: toNumber(row.sort_order, fallback.sortOrder),
  };
}

function mapOffer(row: Record<string, unknown>, fallback: OfferItem): OfferItem {
  const iconValue = String(row.icon_key ?? fallback.iconKey);
  const iconKey = (['gift', 'cake', 'users'].includes(iconValue)
    ? iconValue
    : fallback.iconKey) as OfferItem['iconKey'];

  return {
    ...fallback,
    id: String(row.id ?? fallback.id),
    iconKey,
    title: String(row.title ?? fallback.title),
    description: String(row.description ?? fallback.description),
    price: String(row.price ?? fallback.price),
    features: asStringArray(row.features, fallback.features),
    popular: Boolean(row.popular ?? fallback.popular),
    sortOrder: toNumber(row.sort_order, fallback.sortOrder),
  };
}

async function syncRows<T extends { id: string }>(table: string, rows: T[]) {
  const client = assertSupabase();
  const { data: existingRows, error: existingError } = await client.from(table).select('id');
  if (existingError) throw existingError;

  const incomingIds = new Set(rows.map((row) => row.id));
  const existingIds = (existingRows ?? []).map((row) => String((row as { id: string }).id));
  const idsToDelete = existingIds.filter((id) => !incomingIds.has(id));

  if (idsToDelete.length > 0) {
    const { error: deleteError } = await client.from(table).delete().in('id', idsToDelete);
    if (deleteError) throw deleteError;
  }

  if (rows.length > 0) {
    const { error: upsertError } = await client.from(table).upsert(rows, { onConflict: 'id' });
    if (upsertError) throw upsertError;
  }
}

export function ContentProvider({ children }: PropsWithChildren) {
  const [content, setContent] = useState<SiteContent>(() => cloneFallbackContent());
  const [isLoading, setIsLoading] = useState(true);
  const [source, setSource] = useState<ContentSource>('fallback');
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!supabase) {
      setContent(cloneFallbackContent());
      setSource('fallback');
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const nextContent = cloneFallbackContent();
    const fallback = cloneFallbackContent();
    const errors: string[] = [];
    let hasRemoteData = false;

    try {
      const [settingsResult, questsResult, galleryResult, reviewsResult, offersResult] =
        await Promise.all([
          supabase.from('site_settings').select('*').limit(1),
          supabase.from('quests').select('*').order('sort_order', { ascending: true }),
          supabase.from('gallery').select('*').order('sort_order', { ascending: true }),
          supabase.from('reviews').select('*').order('sort_order', { ascending: true }),
          supabase.from('offers').select('*').order('sort_order', { ascending: true }),
        ]);

      if (settingsResult.error) {
        errors.push(`site_settings: ${settingsResult.error.message}`);
      } else if (settingsResult.data && settingsResult.data.length > 0) {
        nextContent.siteSettings = mapSiteSettings(
          settingsResult.data[0] as Record<string, unknown>,
          fallback.siteSettings,
        );
        hasRemoteData = true;
      }

      if (questsResult.error) {
        errors.push(`quests: ${questsResult.error.message}`);
      } else if (questsResult.data && questsResult.data.length > 0) {
        nextContent.quests = normalizeQuests(
          questsResult.data.map((row, index) =>
            mapQuest(
              row as Record<string, unknown>,
              fallback.quests[index] ?? {
                ...fallback.quests[0],
                id: `quest_remote_${index + 1}`,
                sortOrder: index + 1,
              },
            ),
          ),
        );
        hasRemoteData = true;
      }

      if (galleryResult.error) {
        errors.push(`gallery: ${galleryResult.error.message}`);
      } else if (galleryResult.data && galleryResult.data.length > 0) {
        nextContent.gallery = normalizeGallery(
          galleryResult.data.map((row, index) =>
            mapGallery(
              row as Record<string, unknown>,
              fallback.gallery[index] ?? {
                ...fallback.gallery[0],
                id: `gallery_remote_${index + 1}`,
                sortOrder: index + 1,
              },
            ),
          ),
        );
        hasRemoteData = true;
      }

      if (reviewsResult.error) {
        errors.push(`reviews: ${reviewsResult.error.message}`);
      } else if (reviewsResult.data && reviewsResult.data.length > 0) {
        nextContent.reviews = normalizeReviews(
          reviewsResult.data.map((row, index) =>
            mapReview(
              row as Record<string, unknown>,
              fallback.reviews[index] ?? {
                ...fallback.reviews[0],
                id: `review_remote_${index + 1}`,
                sortOrder: index + 1,
              },
            ),
          ),
        );
        hasRemoteData = true;
      }

      if (offersResult.error) {
        errors.push(`offers: ${offersResult.error.message}`);
      } else if (offersResult.data && offersResult.data.length > 0) {
        nextContent.offers = normalizeOffers(
          offersResult.data.map((row, index) =>
            mapOffer(
              row as Record<string, unknown>,
              fallback.offers[index] ?? {
                ...fallback.offers[0],
                id: `offer_remote_${index + 1}`,
                sortOrder: index + 1,
              },
            ),
          ),
        );
        hasRemoteData = true;
      }

      setContent(nextContent);
      setSource(hasRemoteData ? 'supabase' : 'fallback');
      setError(errors.length > 0 ? errors.join(' | ') : null);
    } catch (loadError) {
      setContent(cloneFallbackContent());
      setSource('fallback');
      setError(loadError instanceof Error ? loadError.message : 'Не удалось загрузить контент');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const saveSiteSettings = useCallback(async (settings: SiteSettings) => {
    const client = assertSupabase();
    const payload = {
      id: settings.id || 'default',
      phone: settings.phone,
      phone_display: settings.phoneDisplay,
      whatsapp_number: settings.whatsappNumber,
      email: settings.email,
      city: settings.city,
      address: settings.address,
      address_short: settings.addressShort,
      floor: settings.floor,
      open_hour: settings.openHour,
      close_hour: settings.closeHour,
      open_status_text: settings.openStatusText,
      closed_status_text: settings.closedStatusText,
      work_hours_label: settings.workHoursLabel,
      work_hours: settings.workHours,
      landmark_primary: settings.landmarkPrimary,
      landmark_secondary: settings.landmarkSecondary,
      hero_subtitle: settings.heroSubtitle,
      hero_description: settings.heroDescription,
      hero_primary_cta: settings.heroPrimaryCta,
      hero_secondary_cta: settings.heroSecondaryCta,
      rating_label: settings.ratingLabel,
      rating_value: settings.ratingValue,
      rating_votes_label: settings.ratingVotesLabel,
      rating_votes: settings.ratingVotes,
      reviews_count: settings.reviewsCount,
      gallery_count_label: settings.galleryCountLabel,
      map_embed_url: settings.mapEmbedUrl,
      yandex_org_url: settings.yandexOrgUrl,
      features: settings.features,
      payment_methods: settings.paymentMethods,
    };

    const { error: upsertError } = await client.from('site_settings').upsert(payload, {
      onConflict: 'id',
    });
    if (upsertError) throw upsertError;

    setContent((prev) => ({
      ...prev,
      siteSettings: { ...settings },
    }));
    setSource('supabase');
    setError(null);
  }, []);

  const saveQuests = useCallback(async (quests: QuestItem[]) => {
    const normalized = normalizeQuests(quests);
    const rows = normalized.map((quest) => ({
      id: quest.id,
      category: quest.category,
      title: quest.title,
      subtitle: quest.subtitle,
      price: quest.price,
      duration: quest.duration,
      players: quest.players,
      difficulty: quest.difficulty,
      description: quest.description,
      image: quest.image,
      tags: quest.tags,
      sort_order: quest.sortOrder,
    }));

    await syncRows('quests', rows);

    setContent((prev) => ({
      ...prev,
      quests: normalized,
    }));
    setSource('supabase');
    setError(null);
  }, []);

  const saveGallery = useCallback(async (gallery: GalleryItem[]) => {
    const normalized = normalizeGallery(gallery);
    const rows = normalized.map((item) => ({
      id: item.id,
      url: item.url,
      alt: item.alt,
      category: item.category,
      sort_order: item.sortOrder,
    }));

    await syncRows('gallery', rows);

    setContent((prev) => ({
      ...prev,
      gallery: normalized,
    }));
    setSource('supabase');
    setError(null);
  }, []);

  const saveReviews = useCallback(async (reviews: ReviewItem[]) => {
    const normalized = normalizeReviews(reviews);
    const rows = normalized.map((review) => ({
      id: review.id,
      name: review.name,
      date_label: review.date,
      rating: review.rating,
      text: review.text,
      quest: review.quest,
      pinned: review.pinned,
      reply_text: review.reply?.text ?? null,
      reply_date: review.reply?.date ?? null,
      sort_order: review.sortOrder,
    }));

    await syncRows('reviews', rows);

    setContent((prev) => ({
      ...prev,
      reviews: normalized,
    }));
    setSource('supabase');
    setError(null);
  }, []);

  const saveOffers = useCallback(async (offers: OfferItem[]) => {
    const normalized = normalizeOffers(offers);
    const rows = normalized.map((offer) => ({
      id: offer.id,
      icon_key: offer.iconKey,
      title: offer.title,
      description: offer.description,
      price: offer.price,
      features: offer.features,
      popular: offer.popular,
      sort_order: offer.sortOrder,
    }));

    await syncRows('offers', rows);

    setContent((prev) => ({
      ...prev,
      offers: normalized,
    }));
    setSource('supabase');
    setError(null);
  }, []);

  const uploadGalleryImage = useCallback(async (file: File) => {
    const client = assertSupabase();
    const ext = file.name.split('.').pop() || 'jpg';
    const uniqueId = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const path = `gallery/${uniqueId}.${ext}`;

    const { error: uploadError } = await client.storage.from('gallery').upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });
    if (uploadError) throw uploadError;

    const { data } = client.storage.from('gallery').getPublicUrl(path);
    if (!data.publicUrl) {
      throw new Error('Не удалось получить public URL файла');
    }
    return data.publicUrl;
  }, []);

  const value = useMemo<ContentContextValue>(
    () => ({
      content,
      isLoading,
      source,
      error,
      refresh,
      saveSiteSettings,
      saveQuests,
      saveGallery,
      saveReviews,
      saveOffers,
      uploadGalleryImage,
    }),
    [
      content,
      isLoading,
      source,
      error,
      refresh,
      saveSiteSettings,
      saveQuests,
      saveGallery,
      saveReviews,
      saveOffers,
      uploadGalleryImage,
    ],
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent должен использоваться внутри ContentProvider');
  }
  return context;
}
