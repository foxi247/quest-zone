import { useEffect, useMemo, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { useContent } from '@/content/ContentProvider';
import type { GalleryItem, OfferItem, QuestItem, ReviewItem } from '@/content/fallbackContent';
import { supabase } from '@/lib/supabaseClient';

type Tab = 'settings' | 'quests' | 'gallery' | 'reviews' | 'offers';

function makeId(prefix: string) {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return `${prefix}_${crypto.randomUUID()}`;
  return `${prefix}_${Date.now()}`;
}

function move<T>(arr: T[], from: number, dir: -1 | 1) {
  const to = from + dir;
  if (to < 0 || to >= arr.length) return arr;
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function withSortOrder<T extends { sortOrder: number }>(items: T[]): T[] {
  return items.map((item, index) => ({
    ...item,
    sortOrder: index + 1,
  }));
}

export function AdminPanel({ isAdminMode }: { isAdminMode: boolean }) {
  const {
    content,
    source,
    error,
    saveSiteSettings,
    saveQuests,
    saveGallery,
    saveReviews,
    saveOffers,
    uploadGalleryImage,
    refresh,
  } = useContent();

  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>('settings');
  const [session, setSession] = useState<Session | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [settingsDraft, setSettingsDraft] = useState(() => clone(content.siteSettings));
  const [questsDraft, setQuestsDraft] = useState<QuestItem[]>(() => clone(content.quests));
  const [reviewsDraft, setReviewsDraft] = useState<ReviewItem[]>(() => clone(content.reviews));
  const [offersDraft, setOffersDraft] = useState<OfferItem[]>(() => clone(content.offers));
  const [galleryDraft, setGalleryDraft] = useState<GalleryItem[]>(() => clone(content.gallery));
  const [uploadingQuestId, setUploadingQuestId] = useState<string | null>(null);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const pinnedCount = useMemo(
    () => reviewsDraft.filter((review) => review.pinned).length,
    [reviewsDraft],
  );

  useEffect(() => {
    if (!supabase) {
      setLoadingAuth(false);
      return;
    }
    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
      setLoadingAuth(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!open) return;
    setSettingsDraft(clone(content.siteSettings));
    setQuestsDraft(clone(content.quests));
    setReviewsDraft(clone(content.reviews));
    setOffersDraft(clone(content.offers));
    setGalleryDraft(clone(content.gallery));
  }, [content, open]);

  if (!isAdminMode) return null;

  const login = async () => {
    if (!supabase) return;
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) setMsg(authError.message);
    else setMsg(null);
  };

  const logout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  const save = async () => {
    if (!session) {
      setMsg('Нужна авторизация');
      return;
    }
    if (pinnedCount > 3) {
      setMsg('Можно закрепить максимум 3 отзыва');
      return;
    }

    setSaving(true);
    setMsg(null);

    try {
      const questsToSave = withSortOrder(
        questsDraft.map((quest) => ({
          ...quest,
          tags: quest.tags.map((tag) => tag.trim()).filter(Boolean),
        })),
      );
      const reviewsToSave = withSortOrder(
        reviewsDraft.map((review) => ({
          ...review,
          rating: Math.max(1, Math.min(5, Number(review.rating) || 5)),
          reply: review.reply?.text?.trim()
            ? {
                text: review.reply.text.trim(),
                date: review.reply.date?.trim() || review.date,
              }
            : undefined,
        })),
      );
      const offersToSave = withSortOrder(
        offersDraft.map((offer) => ({
          ...offer,
          features: offer.features.map((feature) => feature.trim()).filter(Boolean),
        })),
      );
      const galleryToSave = withSortOrder(
        galleryDraft.map((item) => ({
          ...item,
          alt: item.alt.trim(),
          category: item.category.trim(),
        })),
      );

      await saveSiteSettings(settingsDraft);
      await saveQuests(questsToSave);
      await saveGallery(galleryToSave);
      await saveReviews(reviewsToSave);
      await saveOffers(offersToSave);
      await refresh();
      setMsg('Сохранено в Supabase');
    } catch (saveError) {
      setMsg(saveError instanceof Error ? saveError.message : 'Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  const uploadGallery = async (file: File | null) => {
    if (!file) return;
    setUploadingGallery(true);
    try {
      const url = await uploadGalleryImage(file);
      setGalleryDraft((prev) => [
        ...prev,
        { id: makeId('gallery'), url, alt: file.name, category: 'Новая', sortOrder: prev.length + 1 },
      ]);
      setMsg('Файл загружен, нажмите "Сохранить изменения"');
    } catch (uploadError) {
      setMsg(uploadError instanceof Error ? uploadError.message : 'Ошибка upload');
    } finally {
      setUploadingGallery(false);
    }
  };

  const uploadQuestImage = async (questId: string, file: File | null) => {
    if (!file) return;
    setUploadingQuestId(questId);
    try {
      const url = await uploadGalleryImage(file);
      setQuestsDraft((prev) =>
        prev.map((quest) => (quest.id === questId ? { ...quest, image: url } : quest)),
      );
      setMsg('Картинка квеста загружена, нажмите "Сохранить изменения"');
    } catch (uploadError) {
      setMsg(uploadError instanceof Error ? uploadError.message : 'Ошибка upload');
    } finally {
      setUploadingQuestId(null);
    }
  };

  const updateQuest = (index: number, patch: Partial<QuestItem>) => {
    setQuestsDraft((prev) =>
      prev.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)),
    );
  };

  const updateGalleryItem = (index: number, patch: Partial<GalleryItem>) => {
    setGalleryDraft((prev) =>
      prev.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)),
    );
  };

  const updateReview = (index: number, patch: Partial<ReviewItem>) => {
    setReviewsDraft((prev) =>
      prev.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)),
    );
  };

  const updateOffer = (index: number, patch: Partial<OfferItem>) => {
    setOffersDraft((prev) =>
      prev.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)),
    );
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-[120] px-4 py-2 rounded-lg bg-black/80 border border-cyan-400/50 text-cyan-300 text-sm"
      >
        Admin
      </button>

      {open && (
        <div className="fixed inset-0 z-[130] bg-black/85">
          <div className="h-full max-w-6xl mx-auto p-4">
            <div className="h-full rounded-2xl border border-white/10 bg-[#0d0d0d] flex flex-col overflow-hidden">
              <div className="px-4 py-3 border-b border-white/10 flex items-center gap-3">
                <div className="text-sm text-gray-300">
                  Админка ({source === 'supabase' ? 'Supabase' : 'fallback'})
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="ml-auto px-3 py-2 rounded-lg bg-white/5 text-sm"
                >
                  Закрыть
                </button>
              </div>

              {!supabase ? (
                <div className="p-6 text-sm text-yellow-300">
                  Добавьте VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY
                </div>
              ) : loadingAuth ? (
                <div className="p-6 text-sm text-gray-300">Проверка авторизации...</div>
              ) : !session ? (
                <div className="p-6 max-w-md space-y-3">
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full p-3 rounded-lg bg-black/50 border border-white/10"
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full p-3 rounded-lg bg-black/50 border border-white/10"
                  />
                  <button onClick={() => void login()} className="w-full p-3 rounded-lg bg-cyan-600">
                    Войти
                  </button>
                </div>
              ) : (
                <>
                  <div className="px-4 py-2 border-b border-white/10 flex items-center gap-2 overflow-x-auto">
                    {([
                      ['settings', 'Настройки'],
                      ['quests', 'Квесты'],
                      ['gallery', 'Галерея'],
                      ['reviews', 'Отзывы'],
                      ['offers', 'Акции'],
                    ] as Array<[Tab, string]>).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => setTab(key)}
                        className={`px-3 py-2 rounded-lg text-sm ${tab === key ? 'bg-cyan-600' : 'bg-white/5'}`}
                      >
                        {label}
                      </button>
                    ))}
                    <button onClick={() => void logout()} className="ml-auto px-3 py-2 rounded-lg bg-white/5 text-sm">
                      Выйти
                    </button>
                    <button
                      onClick={() => void save()}
                      disabled={saving}
                      className="px-3 py-2 rounded-lg bg-red-600 text-sm"
                    >
                      {saving ? 'Сохранение...' : 'Сохранить изменения'}
                    </button>
                  </div>

                  {(msg || error) && (
                    <div className="px-4 py-2 text-sm text-cyan-300 border-b border-white/10">
                      {msg || `Ошибка: ${error}`}
                    </div>
                  )}

                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {tab === 'settings' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input value={settingsDraft.phone} onChange={(e) => setSettingsDraft((p) => ({ ...p, phone: e.target.value }))} placeholder="Телефон href (+7989...)" className="p-2 rounded bg-black/40 border border-white/10" />
                        <input value={settingsDraft.phoneDisplay} onChange={(e) => setSettingsDraft((p) => ({ ...p, phoneDisplay: e.target.value }))} placeholder="Телефон отображение" className="p-2 rounded bg-black/40 border border-white/10" />
                        <input value={settingsDraft.whatsappNumber} onChange={(e) => setSettingsDraft((p) => ({ ...p, whatsappNumber: e.target.value }))} placeholder="WhatsApp number" className="p-2 rounded bg-black/40 border border-white/10" />
                        <input value={settingsDraft.email} onChange={(e) => setSettingsDraft((p) => ({ ...p, email: e.target.value }))} placeholder="Email" className="p-2 rounded bg-black/40 border border-white/10" />
                        <input value={settingsDraft.address} onChange={(e) => setSettingsDraft((p) => ({ ...p, address: e.target.value }))} placeholder="Полный адрес" className="p-2 rounded bg-black/40 border border-white/10" />
                        <input value={settingsDraft.addressShort} onChange={(e) => setSettingsDraft((p) => ({ ...p, addressShort: e.target.value }))} placeholder="Короткий адрес" className="p-2 rounded bg-black/40 border border-white/10" />
                        <input value={settingsDraft.floor} onChange={(e) => setSettingsDraft((p) => ({ ...p, floor: e.target.value }))} placeholder="Этаж (цокольный)" className="p-2 rounded bg-black/40 border border-white/10" />
                        <input value={settingsDraft.city} onChange={(e) => setSettingsDraft((p) => ({ ...p, city: e.target.value }))} placeholder="Город" className="p-2 rounded bg-black/40 border border-white/10" />
                        <input value={settingsDraft.heroSubtitle} onChange={(e) => setSettingsDraft((p) => ({ ...p, heroSubtitle: e.target.value }))} placeholder="Hero subtitle" className="p-2 rounded bg-black/40 border border-white/10 md:col-span-2" />
                        <textarea rows={2} value={settingsDraft.heroDescription} onChange={(e) => setSettingsDraft((p) => ({ ...p, heroDescription: e.target.value }))} placeholder="Hero description" className="p-2 rounded bg-black/40 border border-white/10 md:col-span-2" />
                        <input value={settingsDraft.landmarkPrimary} onChange={(e) => setSettingsDraft((p) => ({ ...p, landmarkPrimary: e.target.value }))} placeholder="Ориентир 1" className="p-2 rounded bg-black/40 border border-white/10" />
                        <input value={settingsDraft.landmarkSecondary} onChange={(e) => setSettingsDraft((p) => ({ ...p, landmarkSecondary: e.target.value }))} placeholder="Ориентир 2" className="p-2 rounded bg-black/40 border border-white/10" />
                        <input value={settingsDraft.openStatusText} onChange={(e) => setSettingsDraft((p) => ({ ...p, openStatusText: e.target.value }))} placeholder="Статус open" className="p-2 rounded bg-black/40 border border-white/10" />
                        <input value={settingsDraft.closedStatusText} onChange={(e) => setSettingsDraft((p) => ({ ...p, closedStatusText: e.target.value }))} placeholder="Статус closed" className="p-2 rounded bg-black/40 border border-white/10" />
                        <input type="number" value={settingsDraft.openHour} onChange={(e) => setSettingsDraft((p) => ({ ...p, openHour: Number(e.target.value) }))} placeholder="Час открытия" className="p-2 rounded bg-black/40 border border-white/10" />
                        <input type="number" value={settingsDraft.closeHour} onChange={(e) => setSettingsDraft((p) => ({ ...p, closeHour: Number(e.target.value) }))} placeholder="Час закрытия" className="p-2 rounded bg-black/40 border border-white/10" />
                        <input type="number" step="0.1" value={settingsDraft.ratingValue} onChange={(e) => setSettingsDraft((p) => ({ ...p, ratingValue: Number(e.target.value) }))} placeholder="Рейтинг" className="p-2 rounded bg-black/40 border border-white/10" />
                        <input type="number" value={settingsDraft.ratingVotes} onChange={(e) => setSettingsDraft((p) => ({ ...p, ratingVotes: Number(e.target.value) }))} placeholder="Кол-во оценок" className="p-2 rounded bg-black/40 border border-white/10" />
                        <input type="number" value={settingsDraft.reviewsCount} onChange={(e) => setSettingsDraft((p) => ({ ...p, reviewsCount: Number(e.target.value) }))} placeholder="Кол-во отзывов" className="p-2 rounded bg-black/40 border border-white/10" />
                        <input value={settingsDraft.galleryCountLabel} onChange={(e) => setSettingsDraft((p) => ({ ...p, galleryCountLabel: e.target.value }))} placeholder="Label фото (например 38 фото)" className="p-2 rounded bg-black/40 border border-white/10" />
                        <input value={settingsDraft.mapEmbedUrl} onChange={(e) => setSettingsDraft((p) => ({ ...p, mapEmbedUrl: e.target.value }))} placeholder="Map iframe URL" className="p-2 rounded bg-black/40 border border-white/10 md:col-span-2" />
                        <input value={settingsDraft.yandexOrgUrl} onChange={(e) => setSettingsDraft((p) => ({ ...p, yandexOrgUrl: e.target.value }))} placeholder="URL для отзывов/маршрута" className="p-2 rounded bg-black/40 border border-white/10 md:col-span-2" />
                        <textarea rows={4} value={settingsDraft.features.join('\n')} onChange={(e) => setSettingsDraft((p) => ({ ...p, features: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean) }))} placeholder="Особенности, каждая с новой строки" className="md:col-span-2 p-2 rounded bg-black/40 border border-white/10" />
                        <textarea rows={3} value={settingsDraft.paymentMethods.join('\n')} onChange={(e) => setSettingsDraft((p) => ({ ...p, paymentMethods: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean) }))} placeholder="Способы оплаты, каждый с новой строки" className="md:col-span-2 p-2 rounded bg-black/40 border border-white/10" />
                      </div>
                    )}

                    {tab === 'quests' && (
                      <div className="space-y-3">
                        <button
                          onClick={() =>
                            setQuestsDraft((prev) => [
                              ...prev,
                              {
                                id: makeId('quest'),
                                category: 'regular',
                                title: 'Новый квест',
                                subtitle: '',
                                price: 0,
                                duration: '1 час',
                                players: '2-6 чел',
                                difficulty: 3,
                                description: '',
                                image: '',
                                tags: [],
                                sortOrder: prev.length + 1,
                              },
                            ])
                          }
                          className="px-3 py-2 rounded bg-cyan-700 text-sm"
                        >
                          Добавить квест
                        </button>

                        {questsDraft.map((quest, index) => (
                          <div key={quest.id} className="p-3 rounded-lg border border-white/10 bg-black/30 space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-300">#{index + 1}</span>
                              <select
                                value={quest.category}
                                onChange={(e) => updateQuest(index, { category: e.target.value as QuestItem['category'] })}
                                className="p-2 rounded bg-black/40 border border-white/10 text-sm"
                              >
                                <option value="regular">regular</option>
                                <option value="night">night</option>
                                <option value="advanced">advanced</option>
                              </select>
                              <button onClick={() => setQuestsDraft((prev) => move(prev, index, -1))} className="px-2 py-1 rounded bg-white/5 text-xs">↑</button>
                              <button onClick={() => setQuestsDraft((prev) => move(prev, index, 1))} className="px-2 py-1 rounded bg-white/5 text-xs">↓</button>
                              <button onClick={() => setQuestsDraft((prev) => prev.filter((_, idx) => idx !== index))} className="ml-auto px-2 py-1 rounded bg-red-500/20 text-red-300 text-xs">Удалить</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <input value={quest.title} onChange={(e) => updateQuest(index, { title: e.target.value })} placeholder="Название квеста" className="p-2 rounded bg-black/40 border border-white/10 text-sm" />
                              <input value={quest.subtitle} onChange={(e) => updateQuest(index, { subtitle: e.target.value })} placeholder="Подзаголовок" className="p-2 rounded bg-black/40 border border-white/10 text-sm" />
                              <input type="number" value={quest.price} onChange={(e) => updateQuest(index, { price: Number(e.target.value) || 0 })} placeholder="Цена" className="p-2 rounded bg-black/40 border border-white/10 text-sm" />
                              <input type="number" min={1} max={5} value={quest.difficulty} onChange={(e) => updateQuest(index, { difficulty: Number(e.target.value) || 1 })} placeholder="Сложность" className="p-2 rounded bg-black/40 border border-white/10 text-sm" />
                              <input value={quest.duration} onChange={(e) => updateQuest(index, { duration: e.target.value })} placeholder="Длительность" className="p-2 rounded bg-black/40 border border-white/10 text-sm" />
                              <input value={quest.players} onChange={(e) => updateQuest(index, { players: e.target.value })} placeholder="Игроки" className="p-2 rounded bg-black/40 border border-white/10 text-sm" />
                              <input value={quest.image} onChange={(e) => updateQuest(index, { image: e.target.value })} placeholder="URL картинки квеста" className="p-2 rounded bg-black/40 border border-white/10 text-sm md:col-span-2" />
                              <label className="md:col-span-2 text-xs text-gray-300">
                                <span className="block mb-1">Или загрузить картинку:</span>
                                <input type="file" accept="image/*" onChange={(e) => void uploadQuestImage(quest.id, e.target.files?.[0] ?? null)} className="w-full p-2 rounded bg-black/40 border border-white/10 text-sm" />
                                {uploadingQuestId === quest.id && <span className="text-cyan-300">Загрузка...</span>}
                              </label>
                              <input value={quest.tags.join(', ')} onChange={(e) => updateQuest(index, { tags: e.target.value.split(',').map((tag) => tag.trim()).filter(Boolean) })} placeholder="Теги через запятую" className="p-2 rounded bg-black/40 border border-white/10 text-sm md:col-span-2" />
                              <textarea rows={3} value={quest.description} onChange={(e) => updateQuest(index, { description: e.target.value })} placeholder="Описание квеста" className="p-2 rounded bg-black/40 border border-white/10 text-sm md:col-span-2" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {tab === 'gallery' && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <label className="inline-block px-3 py-2 rounded bg-white/5 text-sm cursor-pointer">
                            Upload
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => void uploadGallery(e.target.files?.[0] ?? null)} />
                          </label>
                          {uploadingGallery && <span className="text-xs text-cyan-300">Загрузка...</span>}
                          <button
                            onClick={() =>
                              setGalleryDraft((prev) => [
                                ...prev,
                                { id: makeId('gallery'), url: '', alt: 'Новое фото', category: 'Новая', sortOrder: prev.length + 1 },
                              ])
                            }
                            className="px-3 py-2 rounded bg-white/5 text-sm"
                          >
                            Добавить фото
                          </button>
                        </div>

                        {galleryDraft.map((item, i) => (
                          <div key={item.id} className="grid grid-cols-1 md:grid-cols-[1fr_220px_140px_auto] gap-2 p-2 rounded bg-black/30 border border-white/10">
                            <input value={item.url} onChange={(e) => updateGalleryItem(i, { url: e.target.value })} className="p-2 rounded bg-black/40 border border-white/10 text-sm" />
                            <input value={item.alt} onChange={(e) => updateGalleryItem(i, { alt: e.target.value })} className="p-2 rounded bg-black/40 border border-white/10 text-sm" />
                            <input value={item.category} onChange={(e) => updateGalleryItem(i, { category: e.target.value })} className="p-2 rounded bg-black/40 border border-white/10 text-sm" />
                            <div className="flex gap-1">
                              <button onClick={() => setGalleryDraft((prev) => move(prev, i, -1))} className="px-2 py-1 rounded bg-white/5 text-xs">↑</button>
                              <button onClick={() => setGalleryDraft((prev) => move(prev, i, 1))} className="px-2 py-1 rounded bg-white/5 text-xs">↓</button>
                              <button onClick={() => setGalleryDraft((prev) => prev.filter((_, idx) => idx !== i))} className="px-2 py-1 rounded bg-red-500/20 text-red-300 text-xs">Удалить</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {tab === 'reviews' && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              setReviewsDraft((prev) => [
                                ...prev,
                                {
                                  id: makeId('review'),
                                  name: 'Новый отзыв',
                                  date: '',
                                  rating: 5,
                                  text: '',
                                  quest: '',
                                  pinned: false,
                                  sortOrder: prev.length + 1,
                                },
                              ])
                            }
                            className="px-3 py-2 rounded bg-cyan-700 text-sm"
                          >
                            Добавить отзыв
                          </button>
                          <span className="text-xs text-gray-400">Pinned top3: {pinnedCount}/3</span>
                        </div>

                        {reviewsDraft.map((review, index) => (
                          <div key={review.id} className="p-3 rounded-lg border border-white/10 bg-black/30 space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-300">#{index + 1}</span>
                              <button onClick={() => setReviewsDraft((prev) => move(prev, index, -1))} className="px-2 py-1 rounded bg-white/5 text-xs">↑</button>
                              <button onClick={() => setReviewsDraft((prev) => move(prev, index, 1))} className="px-2 py-1 rounded bg-white/5 text-xs">↓</button>
                              <label className="text-xs flex items-center gap-1 ml-2">
                                <input
                                  type="checkbox"
                                  checked={review.pinned}
                                  onChange={(e) => {
                                    const checked = e.target.checked;
                                    if (checked && !review.pinned && pinnedCount >= 3) {
                                      setMsg('Можно закрепить максимум 3 отзыва');
                                      return;
                                    }
                                    updateReview(index, { pinned: checked });
                                  }}
                                />
                                pinned
                              </label>
                              <button onClick={() => setReviewsDraft((prev) => prev.filter((_, idx) => idx !== index))} className="ml-auto px-2 py-1 rounded bg-red-500/20 text-red-300 text-xs">Удалить</button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <input value={review.name} onChange={(e) => updateReview(index, { name: e.target.value })} placeholder="Имя" className="p-2 rounded bg-black/40 border border-white/10 text-sm" />
                              <input value={review.date} onChange={(e) => updateReview(index, { date: e.target.value })} placeholder="Дата" className="p-2 rounded bg-black/40 border border-white/10 text-sm" />
                              <input value={review.quest} onChange={(e) => updateReview(index, { quest: e.target.value })} placeholder="Квест" className="p-2 rounded bg-black/40 border border-white/10 text-sm" />
                              <input type="number" min={1} max={5} value={review.rating} onChange={(e) => updateReview(index, { rating: Number(e.target.value) || 5 })} placeholder="Рейтинг" className="p-2 rounded bg-black/40 border border-white/10 text-sm" />
                              <textarea rows={3} value={review.text} onChange={(e) => updateReview(index, { text: e.target.value })} placeholder="Текст отзыва" className="p-2 rounded bg-black/40 border border-white/10 text-sm md:col-span-2" />
                              <input value={review.reply?.text ?? ''} onChange={(e) => updateReview(index, { reply: e.target.value ? { text: e.target.value, date: review.reply?.date || review.date } : undefined })} placeholder="Ответ (опционально)" className="p-2 rounded bg-black/40 border border-white/10 text-sm md:col-span-2" />
                              <input value={review.reply?.date ?? ''} onChange={(e) => updateReview(index, { reply: review.reply ? { ...review.reply, date: e.target.value } : { text: '', date: e.target.value } })} placeholder="Дата ответа" className="p-2 rounded bg-black/40 border border-white/10 text-sm md:col-span-2" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {tab === 'offers' && (
                      <div className="space-y-3">
                        <button
                          onClick={() =>
                            setOffersDraft((prev) => [
                              ...prev,
                              {
                                id: makeId('offer'),
                                iconKey: 'gift',
                                title: 'Новая акция',
                                description: '',
                                price: '',
                                features: [],
                                popular: false,
                                sortOrder: prev.length + 1,
                              },
                            ])
                          }
                          className="px-3 py-2 rounded bg-cyan-700 text-sm"
                        >
                          Добавить акцию
                        </button>

                        {offersDraft.map((offer, index) => (
                          <div key={offer.id} className="p-3 rounded-lg border border-white/10 bg-black/30 space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-300">#{index + 1}</span>
                              <select
                                value={offer.iconKey}
                                onChange={(e) => updateOffer(index, { iconKey: e.target.value as OfferItem['iconKey'] })}
                                className="p-2 rounded bg-black/40 border border-white/10 text-sm"
                              >
                                <option value="gift">gift</option>
                                <option value="cake">cake</option>
                                <option value="users">users</option>
                              </select>
                              <button onClick={() => setOffersDraft((prev) => move(prev, index, -1))} className="px-2 py-1 rounded bg-white/5 text-xs">↑</button>
                              <button onClick={() => setOffersDraft((prev) => move(prev, index, 1))} className="px-2 py-1 rounded bg-white/5 text-xs">↓</button>
                              <label className="text-xs flex items-center gap-1 ml-2">
                                <input type="checkbox" checked={offer.popular} onChange={(e) => updateOffer(index, { popular: e.target.checked })} />
                                популярное
                              </label>
                              <button onClick={() => setOffersDraft((prev) => prev.filter((_, idx) => idx !== index))} className="ml-auto px-2 py-1 rounded bg-red-500/20 text-red-300 text-xs">Удалить</button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <input value={offer.title} onChange={(e) => updateOffer(index, { title: e.target.value })} placeholder="Название акции" className="p-2 rounded bg-black/40 border border-white/10 text-sm md:col-span-2" />
                              <input value={offer.price} onChange={(e) => updateOffer(index, { price: e.target.value })} placeholder="Цена/скидка (например -20%)" className="p-2 rounded bg-black/40 border border-white/10 text-sm" />
                              <input value={offer.features.join(', ')} onChange={(e) => updateOffer(index, { features: e.target.value.split(',').map((item) => item.trim()).filter(Boolean) })} placeholder="Преимущества через запятую" className="p-2 rounded bg-black/40 border border-white/10 text-sm" />
                              <textarea rows={3} value={offer.description} onChange={(e) => updateOffer(index, { description: e.target.value })} placeholder="Описание акции" className="p-2 rounded bg-black/40 border border-white/10 text-sm md:col-span-2" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
