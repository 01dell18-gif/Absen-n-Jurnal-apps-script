# SIGURU v3.2 - Sistem Informasi Guru Terpadu

## Absensi Siswa & Jurnal Mengajar KBM Berbasis Google Apps Script & Google Sheets

[![Platform](https://img.shields.io/badge/Platform-Google%20Apps%20Script-4285F4?logo=google)](https://script.google.com/)
[![Database](https://img.shields.io/badge/Database-Google%20Sheets-34A853?logo=googlesheets)](https://sheets.google.com/)
[![Storage](https://img.shields.io/badge/Storage-Google%20Drive-FBBC05?logo=googledrive)](https://drive.google.com/)
[![Deploy](https://img.shields.io/badge/Deploy-Google%20Clasp%20CLI-black?logo=npm)](https://github.com/google/clasp)
[![Responsive](https://img.shields.io/badge/Design-Mobile%20Responsive-0284c7)](https://github.com/)

---

## 📖 Tentang Aplikasi

**SIGURU v3.2** adalah aplikasi web modern berbasis cloud (*Serverless Google Workspace*) yang dirancang khusus untuk mendigitalisasi administrasi kegiatan belajar mengajar (KBM) di sekolah. Aplikasi ini mempermudah pencatatan presensi harian siswa (baik oleh guru maupun perwakilan murid), penyusunan jurnal mengajar KBM harian, pengarsipan dokumentasi kegiatan ke Google Drive, serta rekapitulasi dan pencetakan laporan resmi ber-kop surat.

Aplikasi ini berjalan 100% tanpa biaya server (*zero hosting cost* / tanpa sewa VPS maupun cPanel) karena seluruh backend dieksekusi oleh **Google Apps Script**, datanya tersimpan aman di **Google Spreadsheet**, dan bukti pembelajaran multi-foto otomatis tersimpan di **Google Drive**.

---

## ✨ Fitur-Fitur Unggulan

### 1. 🛡️ Multi-Role & Kontrol Hak Akses (RBAC)

- **Tamu / Publik (Guest)**:
  - Mengakses halaman publik seperti **Laporan Rekap Absen** dan **Log Hasil Jurnal**.
  - Bersifat hanya-baca (*read-only*), tidak dapat mengedit atau menghapus data.
- **Murid (Perwakilan Kelas / Siswa)**:
  - Dirancang khusus untuk perwakilan kelas (misal: sekretaris atau ketua kelas) yang bertugas mencatat presensi harian teman sekelasnya.
  - Tampilan formulir presensi otomatis disederhanakan: kolom **Nama Guru** dan **Mata Pelajaran** disembunyikan.
  - Pilihan rombel/kelas otomatis terkunci (*read-only*) sesuai kelas asal siswa.
  - Presensi otomatis tersimpan dengan label `Mata Pelajaran: "Presensi Harian"` dan nama pencatat tertera rapi.
- **Guru Pengampu**:
  - Mengisi absensi siswa per jam pelajaran atau mata pelajaran.
  - **Sinkronisasi Presensi Otomatis**: Jika murid sudah mencatat absen di hari yang sama, sistem secara otomatis menarik data kehadiran tersebut ke formulir guru sehingga guru tidak perlu mengabsen ulang dari nol.
  - Mengisi jurnal KBM lengkap dengan upload bukti kegiatan multi-foto ke Google Drive.
  - **Sinkronisasi Otomatis Siswa Tidak Hadir di Jurnal**: Daftar murid yang sakit/izin/alpa otomatis tercentang dan terisi langsung ke kolom jurnal KBM.
  - Filter Rekap Absen & Hasil Jurnal otomatis terkunci pada nama guru yang sedang login.
  - Hak mengedit dan menghapus data presensi dan jurnal yang diinput sendiri.
- **Administrator**:
  - Akses penuh (*Full Control*) ke seluruh data siswa, guru, jurnal, dan log pembelajaran sekolah.
  - Akses menu **Master Data** untuk impor/ekspor data murid dan dewan guru via Excel.
  - Akses grup menu **Pengaturan**:
    - **Pengaturan Sistem**: Mengonfigurasi identitas sekolah, logo, kop surat, tautan sumber data, ID folder Google Drive, parameter kurikulum (Mapel, Kelas, Tahun Ajaran), dan **Tahun Ajaran Aktif**.
    - **Manajemen Pengguna**: Menambah, mengedit, dan menghapus akun (Admin, Guru, Murid) serta fitur impor/ekspor massal via Excel (`.xls` / `.xlsx`).

---

### 2. ⚡ Otomatisasi Cerdas (*Smart Automation*)

- **Deteksi Semester Otomatis**:
  - Seluruh formulir (Form Absensi, Form Jurnal, Rekap Absen, Hasil Jurnal) mendeteksi dan mengisi pilihan **Semester** secara otomatis berdasarkan tanggal sistem:
    - **Ganjil**: Berjalan pada bulan **Juli s.d. Desember** (bulan 7 - 12).
    - **Genap**: Berjalan pada bulan **Januari s.d. Juni** (bulan 1 - 6).
- **Tahun Ajaran Aktif Terpusat**:
  - Administrator dapat menentukan **Tahun Ajaran Aktif** pada menu Pengaturan (tersimpan di Database).
  - Ketika dipilih, seluruh formulir dan filter laporan di SIGURU akan otomatis terisi dengan Tahun Ajaran yang sedang aktif tersebut.
- **Navigasi Akordion Tunggal (*Single-Open Accordion*)**:
  - Sidebar navigasi didesain fokus dan ringkas, di mana membuka salah satu grup menu (*Menu Utama*, *Master Data*, *Laporan & Rekap*, *Pengaturan*) secara otomatis melipat/menutup grup menu lainnya.
- **Badge Versi & Log Pembaruan Interaktif**:
  - Badge versi aplikasi pada sidebar dapat diklik secara interaktif untuk menampilkan popup riwayat pembaruan sistem (*changelog modal*) dari versi ke versi.
- **Salam Waktu Dinamis (*Time-Based Greeting*)**:
  - Ucapan selamat datang otomatis berganti sesuai waktu lokal perangkat pengguna:
    - `Selamat Pagi` (04:00 - 10:59)
    - `Selamat Siang` (11:00 - 14:59)
    - `Selamat Sore` (15:00 - 17:59)
    - `Selamat Malam` (18:00 - 03:59)
- **Jam & Tanggal Digital Real-Time**: Ticker waktu detik berjalan langsung dari perangkat lokal pengguna dalam format bahasa Indonesia resmi.

---

### 3. 📝 Presensi Murid & Jurnal KBM Terintegrasi

- **Input Presensi Kelas**:
  - Searchable Combobox untuk pemilihan cepat Mata Pelajaran dan Rombel/Kelas.
  - Opsi status lengkap: **Hadir (H)**, **Sakit (S)**, **Izin (I)**, **Alpa (A)**, dan **Dispensasi (Dispen)**.
  - Tombol aksi instan *Set Semua Hadir* dan *Reset* untuk efisiensi pengisian.
- **Input Jurnal KBM**:
  - Jam pelajaran, pertemuan ke-, model pembelajaran, rincian materi, murid tidak hadir, dan status ketuntasan materi.
  - Upload multi-foto bukti dokumentasi KBM langsung ke folder Google Drive.
  - Pengecekan otomatis status presensi kelas sebelum pengisian jurnal.
  - Kotak rekomendasi ketuntasan materi yang fleksibel (*editable datalist*): `Tuntas`, `Belum Tuntas`, `Berlanjut`, atau deskripsi bebas.

---

### 4. 📊 Laporan Rekapitulasi & Cetak PDF Resmi

- **Rekap Absen Adaptif**:
  - Jika data presensi berasal dari inputan mandiri murid, sistem secara cerdas menyesuaikan tampilan pada Rekap Absen dan Cetak PDF agar tetap menampilkan presensi tersebut sesuai mata pelajaran dan nama guru yang dipilih saat difilter.
  - Perhitungan persentase kehadiran per siswa (`% Hadir`) dan ringkasan persentase global (Hadir, Sakit, Izin, Alpa, Dispen).
- **Hasil Jurnal Mengajar Guru**:
  - Rekap materi KBM, hari efektif, pratinjau tautan Google Drive, serta fitur edit catatan jurnal dan ganti foto bukti kegiatan.
- **Cetak Dokumen PDF Ber-Kop Surat**:
  - Kop surat dinamis (mendukung gambar banner langsung dari Google Drive/Hosting luar maupun teks resmi multi-baris).
  - Pencantuman legalitas tanda tangan guru pengampu beserta NIP resmi.
  - Pencantuman keterangan **Sumber Data** pada header dan footer dokumen.

---

## 🗄️ Struktur Database Google Spreadsheet

Aplikasi menggunakan **1 Google Spreadsheet** yang memuat **5 Sheet Utama**:

| Nama Sheet | Fungsi / Kegunaan | Skema Kolom (Header) |
| :--- | :--- | :--- |
| **`DataMuridGuru`** | Data induk siswa dan dewan guru | `A: NISN`, `B: Nama Murid`, `C: Jenis Kelamin`, `D: Kelas`, `E: (Pemisah)`, `F: Nama Guru`, `G: NIP` |
| **`HasilAbsen`** | Riwayat log presensi harian murid | `A: NISN`, `B: Nama Murid`, `C: Jenis Kelamin`, `D: Kelas`, `E: Tanggal`, `F: Keterangan`, `G: Mata Pelajaran`, `H: Semester`, `I: Tahun Ajaran`, `J: Nama Guru` |
| **`DataJurnalGlobal`** | Riwayat log jurnal mengajar KBM | `A: Tanggal`, `B: Nama Guru`, `C: Semester`, `D: Tahun Ajaran`, `E: Mata Pelajaran`, `F: Jam Ke`, `G: Kelas`, `H: Pertemuan Ke`, `I: Model Pembelajaran`, `J: Materi Pembelajaran`, `K: Murid Tidak Hadir`, `L: Ketuntasan Materi`, `M: Bukti Kegiatan` |
| **`Pengaturan`** | Konfigurasi sistem, kurikulum & TA aktif | `A: Nama Sekolah`, `B: URL Logo`, `C: Mata Pelajaran`, `D: Kelas`, `E: Tahun Ajaran`, `F: Kop Surat`, `G: Tahun Ajaran Aktif`, `H: (Reserved)`, `I: Link Hasil Absen`, `J: Link Hasil Jurnal`, `K: Folder ID Drive` |
| **`DataUser`** | Akun pengguna (Admin, Guru, Murid) | `A: No`, `B: Username`, `C: Password`, `D: Role`, `E: Kelas Khusus / Nama Guru`, `F: Nama Lengkap / NIP`, `G: NISN` |

---

## 🛠️ Apa Saja yang Perlu Diedit untuk Menggunakan Database Baru?

Jika Anda ingin menduplikasi atau memasang kode ini ke Google Spreadsheet / Database baru, **hanya ada 2 file utama** yang perlu Anda sesuaikan nilainya:

| No | Nama File | Baris / Properti | Apa yang Harus Diubah? | Cara Mendapatkannya |
| :---: | :--- | :--- | :--- | :--- |
| **1** | `Code.gs` | **Baris 9**:<br>`const SPREADSHEET_ID = "..."` | Ganti dengan **Spreadsheet ID** dari Google Spreadsheet baru Anda. | Salin dari URL Spreadsheet:<br>`https://docs.google.com/spreadsheets/d/`**`[ID_DI_SINI]`**`/edit` |
| **2** | `.clasp.json` | **Baris 2**:<br>`"scriptId": "..."` | Ganti dengan **Script ID** dari proyek Apps Script baru Anda. | Di Apps Script baru: klik **Project Settings (⚙️)** > salin nilai pada baris **Script ID**. |
| **3** | `appsscript.json`<br>*(Opsional)* | `"timeZone": "Asia/Makassar"` | Sesuaikan zona waktu sekolah Anda jika diperlukan (contoh: `"Asia/Jakarta"`, `"Asia/Makassar"`, atau `"Asia/Jayapura"`). | Ketik zona waktu standar Olson/IANA. |

---

## 🚀 Panduan Penerapan ke Database Baru & Push via Clasp CLI (Direkomendasikan)

Menggunakan **Google Clasp CLI** (*Command Line Apps Script Projects*) adalah metode paling cepat, modern, dan profesional karena seluruh 14 file kode akan terunggah ke Google Apps Script secara instan dalam 2-3 detik tanpa perlu copy-paste manual satu per satu.

### 📌 Prasyarat (Sebelum Memulai)

1. **Komputer sudah terpasang Node.js** (Versi 16, 18, 20, atau lebih baru).
   - Cek di terminal Anda: `node -v`
2. **Aktifkan Google Apps Script API pada akun Google Anda**:
   - Buka browser dan login ke akun Google Anda, lalu buka tautan: [https://script.google.com/home/usersettings](https://script.google.com/home/usersettings).
   - Ubah toggle **Google Apps Script API** dari posisi *OFF* ke **ON**.
   > ⚠️ **PENTING**: Jika toggle ini belum aktif, perintah `clasp push` akan ditolak oleh Google dengan pesan error *"Google Apps Script API has not been used in project ... or it is disabled"*.

---

### Langkah 1: Buat Google Spreadsheet Baru

1. Buka [Google Sheets](https://sheets.new) di browser Anda.
2. Beri nama file, misalnya: `DATABASE_SIGURU_2026`.
3. Salin **Spreadsheet ID** dari tautan peramban Anda:
   ```text
   https://docs.google.com/spreadsheets/d/165WqO4JjK832W2kC1bY8K5m3bTjM3bXYZ12345/edit
                                          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                                                  (Ini SPREADSHEET_ID Anda)
   ```

### Langkah 2: Buat Folder Google Drive untuk Dokumentasi KBM

1. Buka [Google Drive](https://drive.google.com/).
2. Buat folder baru dengan nama: `DOKUMENTASI_KBM_SIGURU`.
3. Klik kanan folder tersebut > **Bagikan (Share)** > ubah Akses Umum menjadi **"Siapa saja yang memiliki link dapat melihat (Viewer)"** *(agar foto bukti KBM dapat diakses oleh guru)*.
4. Salin **Folder ID** dari tautan folder Drive:
   ```text
   https://drive.google.com/drive/folders/1w1bZ2f1rJ8Gk_ABCD98765XYZ
                                          ^^^^^^^^^^^^^^^^^^^^^^^^^^
                                            (Ini FOLDER_ID_DRIVE Anda)
   ```

### Langkah 3: Buat Proyek Apps Script & Dapatkan Script ID

1. Pada Google Spreadsheet baru yang telah dibuat (Langkah 1), klik menu:
   **Ekstensi (Extensions)** > **Apps Script**.
2. Beri nama proyek skrip, misalnya: `SIGURU Web App Production`.
3. Di panel sebelah kiri, klik ikon **Project Settings (Ikon Gerigi ⚙️)**.
4. Pada bagian **IDs**, cari baris **Script ID**, lalu klik tombol **Salin (Copy)**:
   ```text
   Contoh Script ID: 1hAQqMJGIp0DtRxrC01WIzPcxTPZp13iYZatSDJDh0Gua2chIpnyNYosq
   ```

### Langkah 4: Sesuaikan File Konfigurasi di Folder Proyek Lokal

Buka folder repositori proyek ini di komputer Anda menggunakan VS Code atau editor teks:

1. **Buka file `Code.gs`**:
   - Temukan baris ke-9:
     ```javascript
     const SPREADSHEET_ID = "MASUKKAN_SPREADSHEET_ID_BARU_ANDA";
     ```
   - Tempelkan **Spreadsheet ID** yang Anda dapatkan dari Langkah 1.
   - Simpan file (`Ctrl + S`).

2. **Buka file `.clasp.json`**:
   - Ubah nilainya menjadi:
     ```json
     {
       "scriptId": "MASUKKAN_SCRIPT_ID_BARU_ANDA",
       "rootDir": "."
     }
     ```
   - Tempelkan **Script ID** yang Anda dapatkan dari Langkah 3.
   - Simpan file (`Ctrl + S`).

### Langkah 5: Login Clasp & Push Kode ke Apps Script

Buka Terminal / PowerShell / Command Prompt tepat di dalam direktori folder proyek ini, lalu jalankan perintah berikut:

1. **Login ke Akun Google Anda**:
   ```bash
   npx @google/clasp login
   ```
   - Browser akan otomatis terbuka meminta izin login.
   - Pilih akun Google pemilik Spreadsheet & Apps Script Anda, lalu klik **Izinkan (Allow)**.
   - Terminal akan menampilkan pesan: `Logged in! You may close this page.`

2. **Push Seluruh File Kode ke Google Apps Script**:
   ```bash
   npx @google/clasp push
   ```
   *(Atau gunakan flag force jika diminta konfirmasi: `npx @google/clasp push --force`)*.
   
   - Clasp akan membaca `.clasp.json` dan secara otomatis mengunggah seluruh berkas (`Code.js`, `StyleCSS.html`, `Sidebar.html`, `Header.html`, `AppJS.html`, `Dashboard.html`, `FormAbsen.html`, `FormJurnal.html`, `RekapAbsen.html`, `HasilJurnal.html`, `MasterData.html`, `Pengaturan.html`, `UserManagement.html`, `Login.html`, dan `appsscript.json`).
   - Terminal akan menampilkan konfirmasi:
     ```text
     └─ appsscript.json
     └─ Code.js
     └─ AppJS.html
     └─ Dashboard.html
     ...
     Pushed 16 files.
     ```

3. **Verifikasi**: Buka kembali tab Google Apps Script di peramban Anda, lalu tekan tombol muat ulang (*Refresh / F5*). Seluruh file kode kini telah berada di dalam editor Apps Script Anda!

### Langkah 6: Inisialisasi Database Otomatis (`setupDatabaseSheets`)

Sebelum aplikasi web dipublikasikan, jalankan skrip inisialisasi untuk membuat seluruh tabel dan header:

1. Di editor Google Apps Script, buka file `Code.gs`.
2. Pada dropdown pilihan fungsi di toolbar atas (di sebelah tombol *Debug*), pilih fungsi: **`setupDatabaseSheets`**.
3. Klik tombol **Jalankan (Run)**.
4. Kotak dialog otorisasi izin pertama kali akan muncul:
   - Klik **Tinjau Izin (Review Permissions)**.
   - Pilih akun Google Anda.
   - Klik **Lanjutan (Advanced)** > klik tautan paling bawah: **Buka SIGURU Web App (tidak aman) / Go to project (unsafe)**.
   - Klik **Izinkan (Allow)**.
5. Tunggu 5 detik hingga log eksekusi selesai.
6. **Cek Spreadsheet Anda**: Secara otomatis ke-5 Sheet (`DataMuridGuru`, `HasilAbsen`, `DataJurnalGlobal`, `Pengaturan`, dan `DataUser`) sudah terbuat rapi lengkap beserta header kolom dan satu akun Administrator pertama!

### Langkah 7: Publikasikan Web App (Deploy)

1. Di pojok kanan atas editor Apps Script, klik tombol biru **Terapkan (Deploy)** > pilih **Penerapan baru (New deployment)**.
2. Klik ikon gerigi (*Select type*) di sisi kiri > pilih **Aplikasi web (Web app)**.
3. Konfigurasikan parameter penerapan berikut:
   - **Deskripsi**: `SIGURU v3.2 Production`
   - **Jalankan sebagai (Execute as)**: **Saya (email Anda)**
     *(Wajib dipilih agar akses upload foto KBM ke Drive dan manipulasi Sheet memakai izin akun pemilik).*
   - **Siapa yang memiliki akses (Who has access)**: **Siapa saja (Anyone)**
     *(Wajib dipilih agar bapak/ibu guru dan murid dapat membuka web tanpa kendala izin login Google).*
4. Klik **Terapkan (Deploy)**.
5. Salin tautan **URL Aplikasi Web (Web App URL)** yang berakhiran `/exec`. Tautan ini adalah link resmi SIGURU sekolah Anda!

### Langkah 8: Konfigurasi Awal di Web SIGURU

1. Buka tautan **Web App URL** di peramban Anda.
2. Masuk menggunakan akun admin default:
   - **Username**: `admin`
   - **Password**: `admin123`
3. Buka menu **Pengaturan > Pengaturan Sistem**:
   - Masukkan **Nama Sekolah**.
   - Masukkan tautan **URL Logo**.
   - Masukkan banner atau teks **Kop Surat (Kolom F)**.
   - Masukkan **Folder ID Google Drive** (dari Langkah 2) ke kolom penyimpanan dokumentasi.
   - Masukkan daftar **Mata Pelajaran**, **Rombel/Kelas**, dan **Tahun Ajaran**.
   - Pilih **Tahun Ajaran Aktif** yang berlaku saat ini.
   - Klik **Simpan Semua Pengaturan**.
4. Buka menu **Pengaturan > Manajemen Pengguna**:
   - Ubah password akun `admin` bawaan demi keamanan.
   - Tambahkan akun login untuk bapak/ibu guru dan perwakilan kelas (murid).
   - Atau unduh format template via **Ekspor Excel**, lengkapi data pengguna, lalu unggah kembali via **Impor Excel**.

---

## 🔄 Cara Push Pembaruan Kode Selanjutnya (Update Workflow)

Jika di kemudian hari Anda melakukan perubahan atau perbaikan kode di komputer lokal Anda, Anda **tidak perlu mengulang pembuatan spreadsheet**:

1. Lakukan pengeditan file di komputer lokal.
2. Buka terminal di folder proyek, lalu push kode terbaru:
   ```bash
   npx @google/clasp push
   ```
3. Buka editor Google Apps Script di peramban:
   - Klik tombol **Terapkan (Deploy)** > **Kelola penerapan (Manage deployments)**.
   - Klik ikon **Edit (Pensil)** pada penerapan aktif Anda.
   - Pada dropdown **Versi (Version)**, pilih **Versi baru (New version)**.
   - Klik **Terapkan (Deploy)**.
4. **Selesai!** Seluruh perubahan langsung aktif pada Web App tanpa mengubah tautan URL yang sudah dibagikan ke guru dan murid.

---

## 📋 Alternatif: Penerapan Manual via Web Editor (Tanpa Node.js/CLI)

Bagi Anda yang tidak memiliki akses Node.js atau terminal di komputer, Anda tetap dapat memasang SIGURU secara manual:

1. Ikuti **Langkah 1** (Buat Spreadsheet) dan **Langkah 2** (Buat Folder Drive) di atas.
2. Buka **Ekstensi > Apps Script** di spreadsheet baru.
3. Buat file satu per satu di editor Apps Script dengan menekan ikon **+**:
   - Buat file Skrip: `Code.gs` (salin seluruh kode dari file `Code.gs`).
   - Ubah `const SPREADSHEET_ID = "..."` pada baris ke-9 dengan ID spreadsheet baru Anda.
   - Buat 13 file HTML dengan nama yang persis sama: `StyleCSS`, `Sidebar`, `Header`, `AppJS`, `Dashboard`, `FormAbsen`, `FormJurnal`, `RekapAbsen`, `HasilJurnal`, `MasterData`, `Pengaturan`, `UserManagement`, dan `Login` (lalu salin masing-masing kodenya).
4. Jalankan fungsi `setupDatabaseSheets` dan lakukan otorisasi akun.
5. Klik **Deploy > New deployment > Web App** (*Execute as: Me*, *Who has access: Anyone*).
6. Konfigurasi identitas sekolah melalui menu Pengaturan di web.

---

## 🔑 Kredensial Login Bawaan

Saat fungsi `setupDatabaseSheets()` pertama kali dijalankan, sistem secara otomatis mendaftarkan akun administrator awal:

- **Username**: `admin`
- **Password**: `admin123`
- **Hak Akses**: `Admin`

> ⚠️ **Peringatan Keamanan**: Harap segera perbarui kata sandi akun administrator bawaan setelah proses instalasi selesai melalui menu **Pengaturan > Manajemen Pengguna**.

---

## 💡 Troubleshooting & Pertanyaan Umum (FAQ)

### 1. Muncul error saat push: *"Google Apps Script API has not been used in project ... or it is disabled"*?
- **Penyebab**: Google Apps Script API pada akun Google Anda masih berstatus nonaktif.
- **Solusi**: Buka tautan [https://script.google.com/home/usersettings](https://script.google.com/home/usersettings), ubah toggle **Google Apps Script API** menjadi **ON**, tunggu 30 detik, lalu jalankan kembali `npx @google/clasp push`.

### 2. Muncul error saat push: *"Could not find scriptId in .clasp.json"*?
- **Solusi**: Pastikan berkas `.clasp.json` berada di root folder proyek dan berisi Script ID yang benar:
  ```json
  {"scriptId": "SCRIPT_ID_APPS_SCRIPT_ANDA", "rootDir": "."}
  ```

### 3. Mengapa navigasi halaman menggunakan URL parameter `?page=...`?
- Google Apps Script berjalan di dalam sandbox `<iframe>`. SIGURU memanfaatkan manipulasi URL induk (`window.top.location.href`) sehingga jika pengguna me-refresh halaman (*F5*), peramban tetap berada di halaman yang sedang dibuka dan tidak kembali ke halaman Dashboard.

### 4. Foto bukti kegiatan atau logo kop surat tidak tampil saat dicetak PDF?
- Pastikan folder Google Drive tempat penyimpanan foto atau banner kop surat telah diatur izin berbaginya menjadi **"Siapa saja yang memiliki link dapat melihat (Viewer)"**.

### 5. Mengapa akun Admin tidak terhapus saat melakukan Impor Excel Pengguna?
- Sistem dilengkapi fitur proteksi akun administrator (`importUsersFromExcel()` di backend). Akun dengan role `Admin` akan selalu dipertahankan secara otomatis agar pengelola sekolah tidak pernah terkunci keluar dari sistem.

### 6. Muncul error di Windows PowerShell: *"File ... npx.ps1 cannot be loaded because running scripts is disabled on this system"*?
- **Penyebab**: Kebijakan keamanan bawaan Windows PowerShell (*ExecutionPolicy*) membatasi pengeksekusian berkas skrip `.ps1`.
- **Solusi**: Gunakan perintah `npx.cmd` sebagai pengganti `npx`, misalnya:
  ```bash
  npx.cmd @google/clasp login
  npx.cmd @google/clasp push
  ```
  Atau jalankan terminal melalui aplikasi **Command Prompt (CMD)** standar.

---

## 📄 Lisensi & Hak Penggunaan

Dikembangkan untuk mendukung percepatan digitalisasi administrasi pendidikan dan pembelajaran sekolah di Indonesia. Bebas dimodifikasi, disesuaikan, dan didistribusikan sesuai kebutuhan unit pendidikan masing-masing.
