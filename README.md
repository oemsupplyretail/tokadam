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

## Production check

```bash
npm run build
```
