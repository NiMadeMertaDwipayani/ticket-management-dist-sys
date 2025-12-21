# 🚀 Panduan Deploy Website

Ada beberapa cara untuk membuat website ini bisa diakses oleh orang lain:

## ⚡ Cara Paling Mudah: Netlify (Direkomendasikan)

### Langkah 1: Siapkan File
1. Pastikan semua file sudah ada di folder ini
2. File sudah siap untuk di-deploy!

### Langkah 2: Deploy ke Netlify
1. Buka [https://app.netlify.com](https://app.netlify.com)
2. Login dengan GitHub (atau buat akun baru)
3. Di halaman dashboard, cari bagian **"Sites"**
4. **Drag & Drop** seluruh folder `Proyek Hutan` ke area yang tersedia
5. Tunggu beberapa detik, website langsung online!
6. Netlify akan memberikan URL seperti: `https://random-name-123.netlify.app`

### Keuntungan Netlify:
- ✅ Gratis
- ✅ Cepat (CDN global)
- ✅ Otomatis update jika push ke GitHub
- ✅ HTTPS otomatis
- ✅ Custom domain (opsional)

---

## 📦 Cara Alternatif: GitHub Pages

### Langkah 1: Buat Repository GitHub
1. Buka [https://github.com/new](https://github.com/new)
2. Nama repository: `simulasi-kebijakan-hutan` (atau nama lain)
3. Pilih **Public**
4. Jangan centang "Initialize with README"
5. Klik **"Create repository"**

### Langkah 2: Upload ke GitHub
Jalankan perintah berikut di terminal (di folder project ini):

```bash
# Commit file yang sudah di-add
git commit -m "Deploy: Platform Edukasi Hutan Indonesia"

# Tambahkan remote (ganti USERNAME dengan username GitHub Anda)
git remote add origin https://github.com/USERNAME/simulasi-kebijakan-hutan.git

# Push ke GitHub
git branch -M main
git push -u origin main
```

### Langkah 3: Aktifkan GitHub Pages
1. Buka repository di GitHub
2. Klik **Settings** → scroll ke **Pages**
3. Di **Source**, pilih **"Deploy from a branch"**
4. Branch: **main**, Folder: **/ (root)**
5. Klik **Save**
6. Tunggu 2-3 menit
7. Website akan tersedia di: `https://USERNAME.github.io/simulasi-kebijakan-hutan/`

---

## 🔧 Cara Cepat: Vercel

1. Buka [https://vercel.com](https://vercel.com)
2. Login dengan GitHub
3. Klik **"Add New Project"**
4. Import repository GitHub Anda
5. Klik **"Deploy"**
6. Website langsung online!

---

## 📱 Share Link

Setelah deploy, Anda bisa share link ke:
- Teman-teman
- Dosen
- Kelas
- Media sosial

**Contoh URL:**
- Netlify: `https://simulasi-hutan.netlify.app`
- GitHub Pages: `https://username.github.io/simulasi-kebijakan-hutan`
- Vercel: `https://simulasi-hutan.vercel.app`

---

## ⚠️ Catatan Penting

1. **Pastikan semua file sudah di-commit** sebelum deploy
2. **File CSS dan JS sudah menggunakan path relatif** (sudah benar)
3. **Tidak perlu server backend** - website ini static
4. **Data disimpan di browser** (localStorage) - setiap user punya data sendiri

---

## 🆘 Troubleshooting

**Website tidak muncul?**
- Tunggu 2-5 menit untuk GitHub Pages
- Refresh halaman
- Cek apakah semua file sudah ter-upload

**CSS/JS tidak load?**
- Pastikan path file benar (`css/style.css`, bukan `/css/style.css`)
- Cek console browser untuk error

**Butuh bantuan?**
- Baca dokumentasi GitHub Pages: https://pages.github.com
- Baca dokumentasi Netlify: https://docs.netlify.com

