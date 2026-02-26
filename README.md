# Quest Zone Content Admin

Проект: React + Vite + Tailwind + `vite-plugin-singlefile`.

## Что добавлено
- `ContentProvider` с единым `siteContent`.
- Fallback-контент в [`src/content/fallbackContent.ts`](/c:/Users/farxa/OneDrive/Desktop/quest%20zone/src/content/fallbackContent.ts).
- Подключение Supabase в [`src/lib/supabaseClient.ts`](/c:/Users/farxa/OneDrive/Desktop/quest%20zone/src/lib/supabaseClient.ts).
- Админ-панель в [`src/admin/AdminPanel.tsx`](/c:/Users/farxa/OneDrive/Desktop/quest%20zone/src/admin/AdminPanel.tsx).
- Админ-режим только по `?admin=1` или `#admin`.

Обычный режим сайта визуально не меняется. Если Supabase недоступен, используется fallback.

## ENV
Создайте `.env`:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Supabase: таблицы
Запустите в SQL Editor:

```sql
create table if not exists public.site_settings (
  id text primary key,
  phone text not null,
  phone_display text not null,
  whatsapp_number text not null,
  email text not null,
  city text not null,
  address text not null,
  address_short text not null,
  floor text not null,
  open_hour int not null,
  close_hour int not null,
  open_status_text text not null,
  closed_status_text text not null,
  work_hours_label text not null,
  work_hours text not null,
  landmark_primary text not null,
  landmark_secondary text not null,
  hero_subtitle text not null,
  hero_description text not null,
  hero_primary_cta text not null,
  hero_secondary_cta text not null,
  rating_label text not null,
  rating_value numeric not null,
  rating_votes_label text not null,
  rating_votes int not null,
  reviews_count int not null,
  gallery_count_label text not null,
  map_embed_url text not null,
  yandex_org_url text not null,
  features jsonb not null default '[]'::jsonb,
  payment_methods jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.quests (
  id text primary key,
  category text not null check (category in ('regular','night','advanced')),
  title text not null,
  subtitle text not null,
  price int not null,
  duration text not null,
  players text not null,
  difficulty int not null,
  description text not null,
  image text not null,
  tags jsonb not null default '[]'::jsonb,
  sort_order int not null default 0
);

create table if not exists public.gallery (
  id text primary key,
  url text not null,
  alt text not null,
  category text not null,
  sort_order int not null default 0
);

create table if not exists public.reviews (
  id text primary key,
  name text not null,
  date_label text not null,
  rating int not null,
  text text not null,
  quest text not null,
  pinned boolean not null default false,
  reply_text text,
  reply_date text,
  sort_order int not null default 0
);

create table if not exists public.offers (
  id text primary key,
  icon_key text not null check (icon_key in ('gift','cake','users')),
  title text not null,
  description text not null,
  price text not null,
  features jsonb not null default '[]'::jsonb,
  popular boolean not null default false,
  sort_order int not null default 0
);
```

## Supabase Storage (галерея)
Создайте bucket `gallery` (public).

```sql
insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do nothing;
```

## RLS политики
Включите RLS:

```sql
alter table public.site_settings enable row level security;
alter table public.quests enable row level security;
alter table public.gallery enable row level security;
alter table public.reviews enable row level security;
alter table public.offers enable row level security;
```

Публичное чтение:

```sql
create policy "Public read site_settings" on public.site_settings for select using (true);
create policy "Public read quests" on public.quests for select using (true);
create policy "Public read gallery" on public.gallery for select using (true);
create policy "Public read reviews" on public.reviews for select using (true);
create policy "Public read offers" on public.offers for select using (true);
```

Запись только для авторизованного пользователя:

```sql
create policy "Auth write site_settings" on public.site_settings for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy "Auth write quests" on public.quests for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy "Auth write gallery" on public.gallery for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy "Auth write reviews" on public.reviews for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy "Auth write offers" on public.offers for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');
```

Storage policies:

```sql
create policy "Public read gallery storage" on storage.objects for select
using (bucket_id = 'gallery');

create policy "Auth write gallery storage" on storage.objects for all
using (bucket_id = 'gallery' and auth.role() = 'authenticated')
with check (bucket_id = 'gallery' and auth.role() = 'authenticated');
```

## Как открыть админку
- `https://<domain>/?admin=1`
- `https://<domain>/#admin`

После входа через Supabase Auth:
- `site_settings` (телефон, адрес, статус, ориентиры, особенности)
- `quests` (JSON CRUD)
- `gallery` (upload + reorder + delete)
- `reviews` (JSON CRUD + pinned top3)
- `offers` (JSON CRUD)

## Важно
- Singlefile build (`vite-plugin-singlefile`) не менялся.
- В обычном режиме админка не рендерится.
