# SIGURU v3.0 - Sistem Informasi Guru Terpadu

## Absensi Siswa & Jurnal Mengajar KBM Berbasis Google Apps Script & Google Sheets

[![Platform](https://img.shields.io/badge/Platform-Google%20Apps%20Script-4285F4?logo=google)](https://script.google.com/)
[![Database](https://img.shields.io/badge/Database-Google%20Sheets-34A853?logo=googlesheets)](https://sheets.google.com/)
[![Storage](https://img.shields.io/badge/Storage-Google%20Drive-FBBC05?logo=googledrive)](https://drive.google.com/)
[![Responsive](https://img.shields.io/badge/Design-Mobile%20Responsive-0284c7)](https://github.com/)

---

## 📖 Tentang Aplikasi

**SIGURU v3.0** adalah aplikasi web modern berbasis cloud (*Serverless Google Workspace*) yang dirancang khusus untuk mempermudah bapak/ibu guru dan manajemen sekolah dalam mencatat presensi harian siswa, menyusun jurnal mengajar KBM, mengarsipkan dokumentasi kegiatan ke Google Drive, serta merekap dan mencetak laporan resmi ber-kop surat.

Aplikasi ini berjalan 100% tanpa biaya server (tanpa sewa VPS maupun cPanel) karena seluruh backend dieksekusi oleh **Google Apps Script**, datanya tersimpan aman di **Google Spreadsheet**, dan foto bukti pembelajaran otomatis terorganisasi di **Google Drive**.

---

## ✨ Fitur-Fitur Utama

### 1. 🛡️ Multi-Role & Kontrol Hak Akses (RBAC)

- **Tamu / Publik (Guest)**:
  - Mengakses halaman publik seperti **Laporan Rekap Absen** dan **Log Hasil Jurnal**.
  - Bersifat hanya-baca (*read-only*), tidak dapat mengedit atau menghapus data.
- **Guru**:
  - Mengisi absensi siswa per jam pelajaran atau mata pelajaran.
  - Mengisi jurnal KBM lengkap dengan upload bukti kegiatan multi-foto ke Google Drive.
  - Membuka Rekap Absen & Hasil Jurnal dengan filter yang otomatis terkunci pada nama guru yang sedang login.
  - Mengedit dan menghapus data presensi dan jurnal yang diinput sendiri.
- **Administrator**:
  - Akses penuh (*Full Control*) ke seluruh data siswa, guru, dan log pembelajaran sekolah.
  - Akses menu **Master Data** untuk impor/ekspor data murid dan dewan guru.
  - Akses grup menu khusus **Pengaturan**:
    - **Pengaturan Sistem**: Mengonfigurasi identitas sekolah, logo, kop surat laporan, tautan sumber data, ID folder Google Drive, dan daftar kurikulum (Mapel, Kelas, Tahun Ajaran).
    - **Manajemen Pengguna**: Menambah, mengedit, dan menghapus akun guru/admin, serta fitur impor/ekspor massal via Excel (`.xls` / `.xlsx`).

### 2. 🏠 Dashboard Adaptif & Personalisasi Pengguna

- **Salam Waktu Dinamis (*Time-Based Greeting*)**: Ucapan selamat datang otomatis berganti sesuai waktu lokal perangkat pengguna:
  - `Selamat Pagi` (04:00 - 10:59)
  - `Selamat Siang` (11:00 - 14:59)
  - `Selamat Sore` (15:00 - 17:59)
  - `Selamat Malam` (18:00 - 03:59)
  - Diikuti nama guru yang sedang login (contoh: *Selamat Siang, Guru Mapel 1!* atau *Selamat Malam, Administrator!*).
- **Penunjuk Tanggal & Jam Realtime**: Menampilkan hari, tanggal lengkap bahasa Indonesia, dan jam digital yang berdetak setiap detik (*live ticker*) bersumber langsung dari perangkat lokal pengguna (`[Hari], [Tanggal] [Bulan] [Tahun] • [HH:mm:ss]`).
- Indikator status login dan peran aktif di sidebar bawah dan banner dashboard.
- Navbar atas dilengkapi tombol aksi **Icon-Only** ringkas: Sinkron Data Spreadsheet, Hapus Cache Web & Kembali ke Dashboard, serta Login/Keluar.
- Ringkasan statistik operasional real-time (Total Siswa, Dewan Guru, Rombel/Kelas, dan Mata Pelajaran).
- Modul pintasan cepat untuk memulai presensi kelas, mencatat jurnal KBM, dan melihat rekap laporan.

### 3. 📝 Presensi Murid & Jurnal KBM Terintegrasi

- **Input Absensi**:
  - Pilihan parameter kelas, mata pelajaran, semester, tanggal pertemuan, dan tahun ajaran.
  - Kolom nama guru otomatis terkunci pada guru yang sedang login (untuk hak akses Guru), sedangkan Admin dapat memilih nama guru.
  - Status presensi lengkap: Hadir (H), Sakit (S), Izin (I), Alpa (A), dan Dispensasi (Dispen).
  - Tombol aksi instan *Set Semua Hadir* dan *Reset* untuk pengisian cepat.
- **Input Jurnal KBM**:
  - Pencatatan jam pelajaran, pertemuan ke-, model pembelajaran, rincian materi, murid tidak hadir, dan status ketuntasan materi.
  - Pengunggahan berkas bukti kegiatan (*multi-file upload*) yang otomatis dikonversi dan disimpan ke Google Drive.
  - Kolom nama guru otomatis terkunci sesuai akun guru yang sedang aktif.
  - **Pengecekan Presensi Otomatis & Checklist Siswa Tidak Hadir**:
    - Sebelum mengisi murid tidak hadir, sistem menyediakan verifikasi presensi berdasarkan 6 parameter KBM yang telah diisi: **Tanggal**, **Nama Guru**, **Semester**, **Tahun Ajaran**, **Mata Pelajaran**, dan **Kelas**.
    - Jika absensi untuk sesi KBM terkait **belum diisi**, sistem menampilkan kotak peringatan interaktif dan modal dialog yang mengarahkan guru untuk mengisi absensi terlebih dahulu dengan tombol langsung ke halaman Form Absensi Murid.
    - Jika absensi **sudah dicatat**, sistem menampilkan daftar murid kelas tersebut lengkap dengan status kehadiran masing-masing (Hadir, Sakit, Izin, Alpa, Dispensasi).
    - Murid yang berstatus tidak hadir (Sakit, Izin, Alpa, Dispensasi) otomatis tercentang secara bawaan dan rincian namanya langsung mengisi kolom input *Siswa Tidak Hadir* (contoh: `Budi Santoso (S), Siti Aisyah (A)`). Guru juga dapat mencentang atau menghapus centang murid secara manual dengan sinkronisasi teks otomatis.
  - **Status Ketuntasan Materi Fleksibel (Datalist Bebas Ketik)**:
    - Field ketuntasan materi dilengkapi fitur rekomendasi cepat (`Tuntas`, `Belum Tuntas`, `Berlanjut`, `-`) sekaligus dapat diketik bebas sesuai deskripsi perkembangan pencapaian materi pembelajaran.

### 4. 📊 Laporan Rekapitulasi & Log Jurnal Mengajar

- **Rekap Absen Siswa**:
  - Filter berdasarkan kelas, siswa, guru, mata pelajaran, semester, dan tahun ajaran.
  - Perhitungan otomatis persentase kehadiran per siswa (`% Hadir`).
  - Untuk hak akses Guru, filter otomatis terkunci pada nama guru yang login dan hanya menampilkan riwayat presensi yang diajarnya.
- **Hasil Jurnal Guru**:
  - Rekapitulasi materi pembelajaran, persentase ketercapaian target hari efektif mengajar, dan pratinjau tautan bukti dokumentasi Drive.
  - Untuk hak akses Guru, riwayat jurnal otomatis terisolasi untuk guru yang bersangkutan.
  - **Edit & Penggantian Berkas Drive Otomatis**: Formulir edit jurnal tetap menyertakan kolom tautan URL Drive sekaligus input upload file pengganti. Saat berkas baru diunggah, berkas/folder lama di Google Drive secara otomatis dihapus (dengan proteksi folder utama) dan digantikan berkas baru tanpa merusak tautan spreadsheet.
  - **Ketuntasan Materi yang Dapat Diketik Saat Edit**: Modal edit catatan jurnal kini mengizinkan guru untuk memilih dari daftar opsi rekomendasi atau mengetik langsung teks ketuntasan secara fleksibel (*editable datalist*), selaras dengan formulir input log jurnal KBM.

### 5. 🖨️ Cetak & Ekspor Dokumen PDF Berstandar Resmi

- **Kop Surat Dinamis & Rata Tengah**:
  - Mengambil data dari Sheet `Pengaturan` Kolom F (mendukung URL gambar banner atau teks alamat instansi).
  - Pada kop surat berbentuk gambar, garis pembatas biru ganda (*divider line*) otomatis **dihilangkan** dan jarak disesuaikan agar rapi tanpa garis bertumpuk.
- **Pencantuman Sumber Data**:
  - **Laporan Rekap Absen**: Secara otomatis mencantumkan keterangan **Sumber Data** yang bersumber dari Sheet `Pengaturan` Kolom I.
  - **Laporan Jurnal KBM**: Secara otomatis mencantumkan keterangan **Sumber Data** yang bersumber dari Sheet `Pengaturan` Kolom J.
  - Tampil rapi pada metadata header laporan dan footer dokumen cetak.
- **Legalisasi Tanda Tangan**:
  - Kolom tanda tangan otomatis memuat nama guru pengampu dan NIP resmi sesuai data yang difilter.

### 6. ⚙️ Pengaturan Sistem Terpadu (Sheet `Pengaturan`)

Dapat diakses oleh Administrator untuk mengelola parameter operasional langsung dari web tanpa menyentuh spreadsheet:

- **Identitas Sekolah & Logo**: Nama instansi dan URL logo untuk kop, header, dan sidebar.
- **Kop Surat Laporan (Kolom F) dengan Switch Mode**:
  - **Mode Link URL / Teks**: Mendukung tautan URL hosting luar atau Google Drive, serta format teks resmi instansi multi-baris.
  - **Mode Upload File Kop Surat**: Pengguna dapat mengunggah file banner kop langsung dari komputer/HP (PNG, JPG, WEBP). Berkas otomatis diunggah dan disimpan ke Folder Google Drive yang ditentukan pada **Kolom K**, menghasilkan tautan publik siap pakai yang otomatis disimpan ke Kolom F Sheet `Pengaturan` beserta pratinjau langsung (*live preview*).
- **Integrasi Google Drive (Kolom K)**: Folder ID Google Drive untuk penyimpanan foto dokumentasi KBM dan berkas kop surat laporan.
- **Sumber Data Hasil Absen (Kolom I)**: Tautan atau teks sumber data yang dicantumkan saat Cetak PDF Rekap Absen.
- **Sumber Data Hasil Jurnal (Kolom J)**: Tautan atau teks sumber data yang dicantumkan saat Cetak PDF Jurnal KBM.
- **Parameter Kurikulum**: Pengaturan Mata Pelajaran (Kolom C), Rombel/Kelas (Kolom D), dan Tahun Ajaran (Kolom E) (satu baris per entri dengan auto-counter).

### 7. 👥 Manajemen Pengguna & Impor/Ekspor Excel Cepat (Sheet `DataUser`)

- Dikelola pada sheet `DataUser` dengan skema `[No, Username, Password, Role, Nama Guru, NIP]`.
- **Kolom Password & Tombol Mata Interaktif (*Show/Hide Password*)**:
  - Tabel pengguna kini menampilkan kolom **Password** yang dilengkapi tombol mata (`fa-eye` / `fa-eye-slash`).
  - Secara bawaan kata sandi disamarkan (`••••••••`) demi keamanan privasi dan dapat diintip/disalin secara langsung hanya dengan menekan ikon mata.
  - Tombol mata interaktif juga disematkan pada form modal Tambah/Edit Pengguna, modal Login Header, dan form Login Portal.
- **Ekspor Excel (`.xls` / `.xlsx`)**: Mengunduh seluruh data akun guru ke format Excel untuk pembaharuan massal. Akun Administrator sengaja tidak disertakan dalam berkas ekspor demi keamanan.
- **Impor Excel (Replace)**: Menggantikan (*replace*) seluruh akun guru lama dengan data baru dari berkas Excel secara instan.
- **🛡️ Proteksi Akun Administrator**:
  - Seluruh akun Administrator di sheet `DataUser` tetap dipertahankan dan dilindungi sistem saat proses impor replace.
  - Tombol hapus pada akun Admin terkunci (*Dilindungi*) untuk mencegah insiden kehilangan hak akses administrator.

### 8. 📱 Desain Responsif & Ramah Perangkat Mobile (Mobile-Friendly)

- **Grup Menu Tertutup Bawaan (*Closed-by-Default Accordion*)**:
  - Seluruh grup menu navigasi di sidebar (*Menu Utama*, *Master Data*, *Laporan & Rekap*, dan *Pengaturan*) secara bawaan berada dalam keadaan tertutup (*collapsed*).
  - Menu baru menampilkan daftar halamannya saat grup tersebut diklik oleh pengguna, menciptakan tampilan navigasi yang rapi, ringkas, dan fokus.
- **Off-Canvas Drawer Navigation**: Di perangkat smartphone/tablet, sidebar tersembunyi rapi dan dapat dibuka via tombol hamburger navbar atas dengan backdrop overlay blur.
- **Tabel Horisontal Geser**: Seluruh tabel dibungkus `overflow-x-auto` agar nyaman digeser pada layar sentuh.
- **Desain Modern**: Memanfaatkan Tailwind CSS, palet warna elegan, FontAwesome 6, dan modal interaktif SweetAlert2.

---

## 🗄️ Struktur Database Google Spreadsheet

Aplikasi menggunakan 1 Google Spreadsheet dengan **5 Sheet Utama**:

| Nama Sheet | Fungsi / Kegunaan | Skema Kolom (Header) |
| :--- | :--- | :--- |
| **`DataMuridGuru`** | Data induk siswa dan dewan guru | `A: NISN`, `B: Nama Murid`, `C: Jenis Kelamin`, `D: Kelas`, `E: (Pemisah)`, `F: Nama Guru`, `G: NIP` |
| **`HasilAbsen`** | Riwayat log presensi harian murid | `A: NISN`, `B: Nama Murid`, `C: Jenis Kelamin`, `D: Kelas`, `E: Tanggal`, `F: Keterangan`, `G: Mata Pelajaran`, `H: Semester`, `I: Tahun Ajaran`, `J: Nama Guru` |
| **`DataJurnalGlobal`** | Riwayat log pelaksanaan jurnal mengajar KBM | `A: Tanggal`, `B: Nama Guru`, `C: Semester`, `D: Tahun Ajaran`, `E: Mata Pelajaran`, `F: Jam Ke`, `G: Kelas`, `H: Pertemuan Ke`, `I: Model Pembelajaran`, `J: Materi Pembelajaran`, `K: Murid Tidak Hadir`, `L: Ketuntasan Materi`, `M: Bukti Kegiatan` |
| **`Pengaturan`** | Parameter konfigurasi sistem & kurikulum | `A: Nama Sekolah`, `B: URL Logo`, `C: Mata Pelajaran`, `D: Kelas`, `E: Tahun Ajaran`, `F: Kop Surat`, `G-H: (Kosong)`, `I: Link Hasil Absen`, `J: Link Hasil Jurnal`, `K: Folder ID Drive` |
| **`DataUser`** | Akun kredensial login & hak akses | `A: No`, `B: Username`, `C: Password`, `D: Role`, `E: Nama Guru`, `F: NIP` |

---

## 🚀 Panduan Penerapan di Sheet Baru (Step-by-Step)

Ikuti panduan lengkap ini untuk memasang dan menjalankan aplikasi SIGURU pada akun Google atau Spreadsheet baru Anda dari nol:

### Langkah 1: Buat Google Spreadsheet Baru

1. Buka [Google Sheets](https://sheets.new) di browser Anda.
2. Beri nama spreadsheet Anda, misalnya: `DATABASE_SIGURU_SEKOLAH`.
3. Salin **ID Spreadsheet** dari URL browser Anda:

   ```text
   https://docs.google.com/spreadsheets/d/ [SALIN_KODE_ID_DI_BAGIAN_INI] /edit
   ```

### Langkah 2: Buat Folder Google Drive untuk Foto Bukti KBM

1. Buka [Google Drive](https://drive.google.com/).
2. Buat satu folder baru (contoh nama: `DOKUMENTASI_KBM_SIGURU`).
3. Klik kanan folder tersebut > **Bagikan (Share)** > ubah Akses Umum menjadi **"Siapa saja yang memiliki link dapat melihat (Viewer)"** *(agar foto bukti KBM dapat dibuka oleh guru dan pengawas)*.
4. Salin **Folder ID** dari URL folder tersebut:

   ```text
   https://drive.google.com/drive/folders/ [SALIN_FOLDER_ID_INI]
   ```

### Langkah 3: Buka Editor Google Apps Script

1. Pada Google Spreadsheet baru yang telah Anda buat di Langkah 1, klik menu **Ekstensi (Extensions)** > **Apps Script**.
2. Beri nama proyek skrip Anda, misalnya: `SIGURU Web App v3.0`.

### Langkah 4: Buat File Kode Proyek

Buat berkas-berkas kode di dalam editor Apps Script sesuai struktur berikut (gunakan tombol **+** di sebelah panel *Files*):

#### A. File Skrip (.gs)

1. `Code.gs` — Salin seluruh isi file [Code.gs](file:///d:/Downloads/Share-DKV%20F/COBA/Absen&Jurnal%20Apps%20Script/Code.gs).

#### B. File HTML (.html)

Buat masing-masing file HTML berikut dan salin kodenya dari repositori:

1. `StyleCSS.html` — Styling global & pustaka Tailwind CSS, FontAwesome 6, SweetAlert2, SheetJS.
2. `Sidebar.html` — Navigasi sidebar akordion responsif dengan pembagian 4 grup menu.
3. `Header.html` — Navbar atas, tombol hamburger, sinkronisasi data, profil login, dan modal login.
4. `AppJS.html` — Arsitektur RPC client, session management, navigasi URL iframe-safe, dan role gatekeeping.
5. `Dashboard.html` — Tampilan dashboard utama, kartu statistik, dan modul pintasan.
6. `FormAbsen.html` — Form pencatatan presensi siswa per kelas dengan auto-lock nama guru.
7. `FormJurnal.html` — Form pencatatan jurnal KBM dan upload multi-file dokumentasi ke Drive.
8. `RekapAbsen.html` — Laporan rekapitulasi absensi murid, statistik kehadiran, dan cetak PDF.
9. `HasilJurnal.html` — Laporan rekapitulasi jurnal guru harian dan cetak PDF landscape.
10. `MasterData.html` — Pengelolaan data induk siswa dan guru serta impor/ekspor Excel.
11. `Pengaturan.html` — Halaman pengaturan sistem (Sheet `Pengaturan`).
12. `UserManagement.html` — Halaman manajemen akun pengguna (Sheet `DataUser`) & impor/ekspor Excel.
13. `Login.html` — Halaman fallback login mandiri.

### Langkah 5: Hubungkan ID Spreadsheet

Buka file `Code.gs` di editor Apps Script, lalu ubah baris ke-9 dengan ID Spreadsheet Anda dari Langkah 1:

```javascript
const SPREADSHEET_ID = "MASUKKAN_ID_SPREADSHEET_ANDA_DI_SINI";
```

Simpan perubahan (*Ctrl + S*).

### Langkah 6: Inisialisasi Database Otomatis

1. Pada dropdown daftar fungsi di toolbar atas editor Apps Script, pilih fungsi **`setupDatabaseSheets`**.
2. Klik tombol **Jalankan (Run)**.
3. Dialog otorisasi akan muncul:
   - Klik **Tinjau Izin (Review Permissions)**.
   - Pilih akun Google Anda.
   - Klik **Lanjutan (Advanced)** > klik **Buka SIGURU (tidak aman) / Go to project (unsafe)**.
   - Klik **Izinkan (Allow)**.
4. Fungsi ini akan secara otomatis:
   - Membuat ke-5 sheet yang diperlukan: `DataMuridGuru`, `HasilAbsen`, `DataJurnalGlobal`, `Pengaturan`, dan `DataUser`.
   - Mengisi baris judul (header) standar pada masing-masing sheet.
   - Membuat akun Administrator default jika sheet `DataUser` masih kosong.

### Langkah 7: Publikasikan Web App (Deploy as Web App)

1. Klik tombol biru **Terapkan (Deploy)** di pojok kanan atas editor > pilih **Penerapan baru (New deployment)**.
2. Klik ikon gerigi di sebelah kiri (*Select type*) > pilih **Aplikasi web (Web app)**.
3. Isi konfigurasi deployment:
   - **Deskripsi**: `SIGURU v3.0 Production`
   - **Jalankan sebagai (Execute as)**: **Saya (email Anda)** *(Sangat penting: agar fungsi upload ke Drive dan penulisan sheet menggunakan izin akun pemilik).*
   - **Siapa yang memiliki akses (Who has access)**: **Siapa saja (Anyone)** *(Penting: agar bapak/ibu guru dapat membuka aplikasi secara instan tanpa hambatan login akun Google).*
4. Klik **Terapkan (Deploy)**.
5. Salin tautan **URL Aplikasi Web (Web App URL)** yang dihasilkan. Tautan ini adalah alamat web resmi aplikasi SIGURU sekolah Anda!

### Langkah 8: Konfigurasi Awal Sistem

1. Buka Web App URL di browser Anda.
2. Klik tombol **Login** di pojok kanan atas, lalu masuk menggunakan akun administrator bawaan:
   - **Username**: `admin`
   - **Password**: `admin123`
3. Masuk ke grup menu **Pengaturan > Pengaturan Sistem**:
   - Masukkan **Nama Sekolah**.
   - Masukkan tautan **URL Logo Sekolah**.
   - Masukkan tautan banner atau teks **Kop Surat (Kolom F)**.
   - Masukkan **Folder ID Google Drive** yang disalin di Langkah 2 (ke kolom K).
   - Masukkan tautan/teks **Sumber Data Hasil Absen (Kolom I)** dan **Sumber Data Hasil Jurnal (Kolom J)**.
   - Masukkan daftar **Mata Pelajaran**, **Rombel/Kelas**, dan **Tahun Ajaran**.
   - Klik **Simpan Semua Pengaturan**.
4. Masuk ke menu **Pengaturan > Manajemen Pengguna**:
   - Tambahkan akun login untuk bapak/ibu guru pengampu.
   - Anda juga dapat menggunakan tombol **Ekspor Excel (.xls)** untuk mendapatkan template berkas, lalu melengkapi data guru secara massal di komputer dan mengunggahnya kembali melalui tombol **Impor Excel**.
5. Selesai! Aplikasi kini siap digunakan oleh seluruh dewan guru dan tenaga kependidikan sekolah.

---

## 🔑 Kredensial Login Bawaan

Saat pertama kali diinisialisasi oleh skrip `setupDatabaseSheets()`, sistem membuat satu akun administrator bawaan:

- **Username**: `admin`
- **Password**: `admin123`
- **Hak Akses**: `Admin`

> ⚠️ **Catatan Keamanan**: Segera masuk ke menu **Pengaturan > Manajemen Pengguna** setelah instalasi selesai untuk mengubah kata sandi akun admin bawaan atau membuat akun admin baru yang lebih aman.

---

## 💡 Troubleshooting & Pertanyaan Umum (FAQ)

### 1. Mengapa navigasi menggunakan query parameter `?page=...`?

Google Apps Script berjalan dalam sandbox iframe berdomain `script.googleusercontent.com`. Sistem SIGURU menggunakan navigasi induk (`window.top.location.href`) untuk memperbarui URL pada address bar peramban. Dengan teknik ini, ketika pengguna menekan tombol muat ulang (*refresh / F5*), peramban **tetap berada di halaman yang aktif** dan tidak mental kembali ke Dashboard.

### 2. Gambar logo atau banner kop surat tidak muncul saat dibuka atau dicetak PDF?

Jika Anda menggunakan gambar yang disimpan di Google Drive, pastikan file gambar di Google Drive telah diatur akses berbaginya menjadi **"Siapa saja yang memiliki link (Anyone with the link can view)"**. Sistem SIGURU secara otomatis mengonversi link Google Drive (`file/d/...`) menjadi tautan gambar langsung `https://lh3.googleusercontent.com/d/...` agar dapat dimuat oleh mesin cetak peramban.

### 3. Mengapa saat impor berkas Excel akun admin tidak tertimpa?

Sistem telah dirancang dengan arsitektur proteksi keamanan data. Fungsi `importUsersFromExcel()` di backend secara otomatis memisahkan dan mempertahankan akun Administrator yang sudah ada di sheet `DataUser`, sehingga Anda dapat mengganti seluruh data guru secara instan kapan saja tanpa khawatir terkunci keluar dari sistem.

---

## 📄 Lisensi & Hak Penggunaan

Dikembangkan untuk mendukung percepatan digitalisasi administrasi pembelajaran sekolah di seluruh Indonesia. Bebas disesuaikan dan dikembangkan lebih lanjut sesuai kebutuhan unit pendidikan masing-masing.
