# Spesifikasi Aset Visual

Dokumen ini ialah rujukan sebelum menggantikan mana-mana gambar. Kekalkan **nama fail yang sama** jika anda hanya mahu menukar visual tanpa menyentuh kod. Semua path imej yang digunakan oleh laman berada di `src/content/home.ts` dan `src/data/`.

## Peraturan umum

- Gunakan PNG untuk aset yang perlukan latar belakang transparent.
- Jangan tambah teks penting terlalu hampir dengan tepi gambar; gambar boleh di-crop mengikut skrin.
- Saiz piksel lebih besar tidak semestinya dipaparkan lebih besar. Nisbah, ruang kosong pada kanvas dan background transparent lebih memberi kesan pada layout.
- Simpan fail dengan nama yang sama untuk mengelakkan link gambar rosak.
- Gunakan sRGB dan optimumkan fail untuk web sebelum upload.

## Gambar yang sedang digunakan

| Fail | Saiz semasa | Spesifikasi gantian | Cara laman memaparkan |
| --- | --- | --- | --- |
| `hero-bottle.png` | 900 × 1748 px, PNG transparent | PNG transparent, menegak, disyorkan minimum 900 × 1700 px. Produk perlu berada di tengah kanvas dengan sedikit ruang kosong. | Hero desktop: tinggi 520 px. Mobile: tinggi 300 px. Jangan guna background penuh. |
| `couple.png` | 864 × 1821 px, PNG transparent | PNG transparent, pasangan menegak, disyorkan sekitar 850 × 1800 px. Subjek perlu di tengah dan bahagian atas wajah jelas. | Dipaparkan dalam frame yang di-crop. Jika imej terlalu lebar/rendah atau subjek terlalu dekat ke bawah, kedudukan pasangan akan berubah. |
| `Padox-Pro.png` | 1024 × 1536 px, PNG transparent | PNG transparent, produk menegak, disyorkan minimum 1000 × 1500 px. | Digunakan dalam section penerangan produk; `object-fit: contain`, jadi seluruh produk dikekalkan. |
| `package-01.png` | 1254 × 1254 px, PNG | Kanvas segi empat, 1:1, disyorkan 1200 × 1200 px atau lebih. PNG transparent digalakkan, tetapi putih juga berfungsi. | Kad pakej 1; produk ditengah menggunakan `object-fit: contain`. |
| `package-02.png` | 1254 × 1254 px, PNG | Kanvas segi empat, 1:1, disyorkan 1200 × 1200 px atau lebih. | Kad pakej 2; produk ditengah menggunakan `object-fit: contain`. |
| `package-03.png` | 1254 × 1254 px, PNG | Kanvas segi empat, 1:1, disyorkan 1200 × 1200 px atau lebih. | Kad pakej 3; pakej ini ditanda `PALING LARIS`. |
| `package-04.png` | 1254 × 1254 px, PNG | Kanvas segi empat, 1:1, disyorkan 1200 × 1200 px atau lebih. | Kad pakej 4; produk ditengah menggunakan `object-fit: contain`. |
| `testimonial-01.png` hingga `testimonial-06.png` | 512 × 512 px setiap satu, PNG | Nisbah 1:1, minimum 800 × 800 px disyorkan. Gambar potret dengan wajah di tengah/atas-tengah. | Kad testimonial menggunakan `object-fit: cover`; sisi luar boleh terpotong. Teks ulasan berada di bahagian bawah gambar. |
| `rotate.png` | 972 × 1046 px, PNG transparent | PNG transparent, hampir segi empat, disyorkan minimum 512 × 512 px. Pastikan ikon berada di tengah dan tiada background. | Ikon kecil terapung di bawah kiri, berpusing secara berterusan dan boleh disentuh/diklik. |

## Favicon

| Lokasi | Saiz semasa | Spesifikasi gantian |
| --- | --- | --- |
| `src/app/favicon.ico` | 256 × 256 px, ICO transparent | Gunakan fail `.ico` yang mengandungi sekurang-kurangnya versi 16 × 16, 32 × 32 dan 48 × 48 px. Pastikan ikon ringkas kerana ia sangat kecil dalam tab browser. |

Favicon dirujuk daripada `src/config/theme.ts`. Nama fail boleh ditukar di sana jika perlu, tetapi lokasi `src/app/favicon.ico` ialah tetapan Next.js yang paling mudah untuk dikekalkan.

## Open Graph (OG) / preview link

Laman ini **belum menggunakan** gambar OG khusus. Apabila mahu ditambah kemudian, gunakan spesifikasi berikut:

| Cadangan lokasi | Saiz wajib | Format | Panduan reka bentuk |
| --- | --- | --- | --- |
| `public/og.png` | 1200 × 630 px | PNG atau JPG | Letak logo, produk dan headline penting dalam kawasan tengah. Elakkan teks kecil atau elemen rapat pada tepi kerana WhatsApp/Facebook boleh crop preview. |

Selepas fail `public/og.png` ditambah, metadata perlu dirujuk dalam `src/app/layout.tsx`. Jangan tukar hanya fail gambar jika mahu preview WhatsApp/Facebook berubah.

## Checklist sebelum gantikan gambar

1. Pastikan nama fail tepat seperti jadual di atas.
2. Pastikan format dan nisbah dipatuhi.
3. Untuk produk, pasangan dan ikon: pastikan background transparent.
4. Untuk testimonial: pastikan wajah tidak terlalu ke tepi atau terlalu bawah.
5. Refresh keras browser selepas upload: `Cmd + Shift + R`.
