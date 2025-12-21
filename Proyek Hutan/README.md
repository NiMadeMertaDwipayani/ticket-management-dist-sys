# 🌲 Simulasi Kebijakan Lingkungan - Platform Edukasi Hutan Indonesia

Platform interaktif untuk memahami dampak kebijakan lingkungan berbasis data real-time. Website ini menyediakan simulasi kebijakan, game berpikir kritis, dan mini games edukatif tentang pengelolaan hutan Indonesia.

## 🚀 Fitur

- **Simulasi Kebijakan**: Ambil keputusan kebijakan dengan melihat dampak langsung terhadap berbagai indikator
- **Game Berpikir Kritis**: 
  - Alokasi Sumber Daya
  - Analisis Skenario
  - Perencanaan Strategis
- **Mini Games**: Quiz, Benar/Salah, Quick Match, Puzzle, dan Kategorisasi
- **Data Real-Time**: Informasi faktual tentang hutan Indonesia
- **Edukasi Lengkap**: Konten edukatif dengan referensi sumber data terpercaya

## 📁 Struktur File

```
Proyek Hutan/
├── index.html          # Halaman utama
├── game.html          # Simulasi kebijakan
├── games.html         # Menu game berpikir kritis
├── game-critical.html # Halaman game berpikir kritis
├── mini-games.html    # Menu mini games
├── mini-game-play.html# Halaman mini games
├── debat.html         # Halaman debat kebijakan
├── hasil.html         # Halaman hasil evaluasi
├── css/
│   └── style.css      # Stylesheet utama
└── js/
    ├── game.js        # Logic simulasi kebijakan
    ├── game-critical.js # Logic game berpikir kritis
    ├── mini-games.js  # Logic mini games
    ├── evaluator.js   # Evaluasi AI
    └── chart.js       # Chart utilities
```

## 🌐 Cara Deploy ke GitHub Pages

### Langkah 1: Buat Repository di GitHub
1. Buka [GitHub.com](https://github.com) dan login
2. Klik tombol **"New"** untuk membuat repository baru
3. Beri nama repository (contoh: `simulasi-kebijakan-hutan`)
4. Pilih **Public** (untuk GitHub Pages gratis)
5. Jangan centang "Initialize with README"
6. Klik **"Create repository"**

### Langkah 2: Upload File ke GitHub
1. Buka terminal di folder project ini
2. Jalankan perintah berikut:

```bash
# Inisialisasi git (jika belum)
git init

# Tambahkan semua file
git add .

# Commit perubahan
git commit -m "Initial commit: Platform Edukasi Hutan Indonesia"

# Tambahkan remote repository (ganti USERNAME dan REPO_NAME)
git remote add origin https://github.com/USERNAME/REPO_NAME.git

# Push ke GitHub
git branch -M main
git push -u origin main
```

### Langkah 3: Aktifkan GitHub Pages
1. Buka repository di GitHub
2. Klik tab **"Settings"**
3. Scroll ke bagian **"Pages"** di sidebar kiri
4. Di bagian **"Source"**, pilih **"Deploy from a branch"**
5. Pilih branch **"main"** dan folder **"/ (root)"**
6. Klik **"Save"**
7. Tunggu beberapa menit, website akan tersedia di:
   `https://USERNAME.github.io/REPO_NAME/`

## 🌐 Alternatif: Deploy ke Netlify (Lebih Mudah)

### Cara 1: Drag & Drop
1. Buka [Netlify.com](https://netlify.com) dan login (bisa pakai GitHub)
2. Drag folder project ini ke halaman Netlify
3. Website langsung online!

### Cara 2: Via GitHub
1. Push code ke GitHub (ikuti langkah di atas)
2. Login ke Netlify
3. Klik **"Add new site"** → **"Import an existing project"**
4. Pilih repository GitHub Anda
5. Klik **"Deploy"**
6. Website akan otomatis ter-deploy dan dapat diakses

## 📝 Catatan Penting

- Pastikan semua file HTML menggunakan path relatif (sudah benar)
- File CSS dan JS sudah menggunakan path relatif (`css/style.css`, `js/game.js`)
- Website ini adalah static website, tidak memerlukan server backend
- Semua data disimpan di localStorage browser

## 🔗 Link Akses

Setelah deploy, website dapat diakses melalui:
- **GitHub Pages**: `https://USERNAME.github.io/REPO_NAME/`
- **Netlify**: `https://REPO_NAME.netlify.app` (jika pakai Netlify)

## 📧 Kontak

Untuk pertanyaan atau masukan, silakan buat issue di repository GitHub.

