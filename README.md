# PADOX PRO

## Setup — macOS dan Windows

Pasang Node.js 20.9 atau lebih baharu. Buka Terminal (macOS) atau PowerShell (Windows) dalam folder project, kemudian jalankan:

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

Project ini tidak menggunakan command atau path khusus macOS/Windows; kedua-duanya menggunakan npm.

## Supabase keep-alive

Di Vercel, tambah `CRON_SECRET` sebagai environment variable rawak yang panjang. Cron production akan ping database setiap 5 hari pada 03:00 UTC (11:00 pagi waktu Malaysia) melalui `/api/cron/keep-supabase-alive`.

## Environment variables

Cipta `.env.local` di root project dan masukkan credential payment, Supabase, serta pixel yang diperlukan. `.env.local` tidak disimpan dalam Git, jadi ia perlu disediakan pada setiap komputer dan dalam Vercel sebelum deploy.

## Admin packing list

Dashboard packing list berada di `/admin/orders`. Setup sekali sahaja:

1. Di Supabase Authentication, cipta seorang user admin menggunakan email dan kata laluan yang kuat.
2. Ambil publishable key projek dari Supabase Connect/API settings.
3. Tambah environment variables berikut di `.env.local` dan Vercel:

```env
ADMIN_EMAIL=email-user-admin-yang-sama
SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxx
```

Hanya user yang emailnya sama dengan `ADMIN_EMAIL` boleh membuka senarai order Paid dan packing list. `SUPABASE_SECRET_KEY` kekal digunakan pada server sahaja untuk membaca order.

## Production check

```bash
npm run build
```
