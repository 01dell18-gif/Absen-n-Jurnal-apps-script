/**
 * ==============================================================================
 * SISTEM INFORMASI GURU TERPADU (SIGURU) - ABSENSI & JURNAL KBM v3.0
 * Arsitektur: Server-Side Template Inclusion (Scriptlet Pattern) & Query Parameter Routing
 * Sesuai Standar: "Teknik Pembuatan.md"
 * ==============================================================================
 */

const SPREADSHEET_ID = "1-diq4oheI0S6v6QtF4lbff_9N-fQPuUvXgKxv8gGR_4";

// Variabel Global Runtime untuk Request State
var _activePage = 'dashboard';
var _activeParams = {};

/**
 * ROUTER UTAMA: Multi-Page Application (MPA) berbasis Query Parameter
 * Contoh: ?page=dashboard, ?page=form-absen, ?page=form-jurnal, dll.
 */
function doGet(e) {
  try {
    var page = (e && e.parameter && e.parameter.page) ? String(e.parameter.page).trim().toLowerCase() : 'dashboard';
    _activePage = page;
    _activeParams = (e && e.parameter) ? e.parameter : {};

    // Peta Rute URL ke Berkas HTML Terpisah
    var routeMap = {
      'dashboard': 'Dashboard',
      'index': 'Dashboard',
      'form-absen': 'FormAbsen',
      'form-jurnal': 'FormJurnal',
      'rekap-absen': 'RekapAbsen',
      'hasil-jurnal': 'HasilJurnal',
      'master-data': 'MasterData',
      'user-management': 'UserManagement',
      'pengaturan': 'Pengaturan',
      'pengaturan-sistem': 'Pengaturan',
      'login': 'Login'
    };

    var pageFile = routeMap[page] || 'Dashboard';
    return renderTemplate(pageFile);
  } catch (err) {
    return HtmlService.createHtmlOutput(
      '<div style="font-family:sans-serif; padding:30px; text-align:center;">' +
      '<h2 style="color:#dc2626;">Terjadi Kesalahan Routing</h2>' +
      '<p>' + err.message + '</p>' +
      '<a href="' + getAppUrl() + '?page=dashboard" style="display:inline-block; margin-top:15px; padding:8px 16px; background:#2563eb; color:white; border-radius:6px; text-decoration:none;">Kembali ke Dashboard</a>' +
      '</div>'
    ).setTitle('Error - SIGURU');
  }
}

/**
 * MESIN EVALUASI TEMPLATE & SCRIPTLET INCLUSION
 */
function renderTemplate(pageFile, data) {
  var t;
  try {
    t = HtmlService.createTemplateFromFile(pageFile);
  } catch (e1) {
    try {
      t = HtmlService.createTemplateFromFile(pageFile.toLowerCase());
    } catch (e2) {
      t = HtmlService.createTemplateFromFile('Dashboard');
    }
  }
  t.currentPage = _activePage;
  t.params = _activeParams;
  t.appUrl = getAppUrl();
  if (data && typeof data === 'object') {
    for (var k in data) {
      if (data.hasOwnProperty(k)) t[k] = data[k];
    }
  }
  return t.evaluate()
    .setTitle('SIGURU - Sistem Absensi & Jurnal Guru v3.0')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * FUNGSI INKLUSI SERVER-SIDE (SCRIPTLET PATTERN)
 * Dipanggil di HTML via <?!= include('NamaKomponen'); ?>
 */
function include(filename, data) {
  try {
    var t;
    try {
      t = HtmlService.createTemplateFromFile(filename);
    } catch (e1) {
      t = HtmlService.createTemplateFromFile(filename.toLowerCase());
    }
    t.currentPage = _activePage;
    t.params = _activeParams;
    t.appUrl = getAppUrl();
    if (data && typeof data === 'object') {
      for (var k in data) {
        if (data.hasOwnProperty(k)) t[k] = data[k];
      }
    }
    return t.evaluate().getContent();
  } catch (err) {
    return '<!-- Gagal memuat komponen "' + filename + '": ' + err.message + ' -->';
  }
}

/**
 * UTILITAS APLIKASI
 */
function getAppUrl() {
  try {
    return ScriptApp.getService().getUrl();
  } catch (e) {
    return "";
  }
}

function getSpreadsheet() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function getDriveFolderId() {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName("Pengaturan");
  if (!sheet) return "";
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][10]) return String(data[i][10]).trim();
  }
  return "";
}

/**
 * SETUP AWAL DATABASE: Memastikan 4 Sheet Utama Tersedia dengan Header Standar
 */
function setupDatabaseSheets() {
  const ss = getSpreadsheet();
  const requiredSheets = [
    { name: "DataMuridGuru", headers: ["NISN", "Nama Murid", "Jenis Kelamin", "Kelas", "", "Nama Guru", "NIP"] },
    { name: "HasilAbsen", headers: ["NISN", "Nama Murid", "Jenis Kelamin", "Kelas", "Tanggal", "Keterangan", "Mata Pelajaran", "Semester", "Tahun Ajaran", "Nama Guru"] },
    { name: "DataJurnalGlobal", headers: ["Tanggal", "Nama Guru", "Semester", "Tahun Ajaran", "Mata Pelajaran", "Jam Ke", "Kelas", "Pertemuan Ke", "Model Pembelajaran", "Materi Pembelajaran", "Murid Tidak Hadir", "Ketuntasan Materi", "Bukti Kegiatan"] },
    { name: "Pengaturan", headers: ["Nama Sekolah", "URL Logo Sekolah", "Mata Pelajaran", "Kelas", "Tahun Ajaran", "Kop Surat", "", "", "Link Hasil Absen", "Link Hasil Jurnal", "Folder ID Drive"] },
    { name: "DataUser", headers: ["No", "Username", "Password", "Roll", "Nama Guru", "NIP"] }
  ];

  requiredSheets.forEach(item => {
    let sheet = ss.getSheetByName(item.name);
    if (!sheet) {
      sheet = ss.insertSheet(item.name);
      if (item.headers.length > 0) {
        sheet.appendRow(item.headers);
      }
    }
  });

  // Pastikan kolom 10 pada HasilAbsen memiliki header "Nama Guru" jika belum ada
  const sheetAbsen = ss.getSheetByName("HasilAbsen");
  if (sheetAbsen && sheetAbsen.getLastRow() >= 1) {
    const h10 = sheetAbsen.getRange(1, 10).getValue();
    if (!h10) {
      sheetAbsen.getRange(1, 10).setValue("Nama Guru");
    }
  }

  // Pastikan ada akun admin default jika DataUser masih kosong
  const sheetUser = ss.getSheetByName("DataUser");
  if (sheetUser && sheetUser.getLastRow() <= 1) {
    sheetUser.appendRow([1, "admin", "admin123", "Admin", "Administrator", ""]);
  }

  return "Database berhasil diverifikasi/dibuat.";
}

/**
 * PENGAMBILAN DATA AWAL (INITIAL DATA LOADER)
 */
function getInitialData() {
  const ss = getSpreadsheet();
  
  // 1. Sheet Pengaturan
  const sheetPengaturan = ss.getSheetByName("Pengaturan");
  const dataPengaturan = sheetPengaturan ? sheetPengaturan.getDataRange().getValues() : [];
 
  let namaSekolah = "NAMA SEKOLAH";
  let logoUrl = "https://via.placeholder.com/60";
  let kopSurat = "";
  let mapelList = [];
  let kelasListPengaturan = [];
  let taList = [];
  let linkHasilAbsen = "";
  let linkHasilJurnal = "";

  if (dataPengaturan.length > 1) {
    for (let i = 1; i < dataPengaturan.length; i++) {
      if (dataPengaturan[i][0] && (!namaSekolah || namaSekolah === "NAMA SEKOLAH")) namaSekolah = String(dataPengaturan[i][0]).trim();
      if (dataPengaturan[i][1] && (!logoUrl || logoUrl.includes("via.placeholder"))) logoUrl = String(dataPengaturan[i][1]).trim();
      if (dataPengaturan[i][2]) mapelList.push(String(dataPengaturan[i][2]).trim());
      if (dataPengaturan[i][3]) kelasListPengaturan.push(String(dataPengaturan[i][3]).trim());
      if (dataPengaturan[i][4]) taList.push(String(dataPengaturan[i][4]).trim());
      // Kolom F (index 5) = Kop Surat (URL Gambar / Teks HTML)
      if (dataPengaturan[i][5] && !kopSurat) kopSurat = String(dataPengaturan[i][5]).trim();
      // Kolom I (index 8) = Sumber Data Hasil Absen
      if (dataPengaturan[i][8] && !linkHasilAbsen) linkHasilAbsen = String(dataPengaturan[i][8]).trim();
      // Kolom J (index 9) = Sumber Data Hasil Jurnal
      if (dataPengaturan[i][9] && !linkHasilJurnal) linkHasilJurnal = String(dataPengaturan[i][9]).trim();
    }
  }

  // 2. Sheet DataMuridGuru
  const sheetMG = ss.getSheetByName("DataMuridGuru");
  const dataMG = sheetMG ? sheetMG.getDataRange().getValues() : [];
  let muridList = [];
  let guruList = [];
  let kelasListMurid = [];

  if (dataMG.length > 1) {
    for (let i = 1; i < dataMG.length; i++) {
      // Kolom A-D: Murid
      if (dataMG[i][1]) {
        let nisnRaw = String(dataMG[i][0] || '').replace(/'/g, '').trim();
        if (nisnRaw.length > 0 && !isNaN(nisnRaw)) {
          nisnRaw = ("0000000000" + nisnRaw).slice(-10);
        }
        let kelas = String(dataMG[i][3] || '').trim();
        muridList.push({
          nisn: nisnRaw,
          nama: String(dataMG[i][1]).trim(),
          jk: String(dataMG[i][2] || '').trim(),
          kelas: kelas
        });
        if (kelas && !kelasListMurid.includes(kelas)) {
          kelasListMurid.push(kelas);
        }
      }
      // Kolom F-G: Guru
      if (dataMG[i][5]) {
        let nipRaw = String(dataMG[i][6] || '').replace(/'/g, '').trim();
        guruList.push({
          nama: String(dataMG[i][5]).trim(),
          nip: nipRaw
        });
      }
    }
  }

  // 3. Masukkan juga guru dari sheet DataUser jika ada
  const sheetUser = ss.getSheetByName("DataUser");
  if (sheetUser && sheetUser.getLastRow() > 1) {
    const dataUser = sheetUser.getRange(2, 1, sheetUser.getLastRow() - 1, 6).getValues();
    dataUser.forEach(r => {
      const nGuru = String(r[4] || '').trim();
      const nNip = String(r[5] || '').replace(/'/g, '').trim();
      if (nGuru && !guruList.some(g => g.nama.toLowerCase() === nGuru.toLowerCase())) {
        guruList.push({
          nama: nGuru,
          nip: nNip
        });
      }
    });
  }

  return {
    pengaturan: {
      namaSekolah,
      logoUrl,
      kopSurat,
      linkHasilAbsen,
      linkHasilJurnal,
      mapelList: [...new Set(mapelList)].filter(Boolean),
      kelasList: [...new Set([...kelasListPengaturan, ...kelasListMurid])].filter(Boolean),
      taList: [...new Set(taList)].filter(Boolean)
    },
    muridList,
    guruList
  };
}

/**
 * SISTEM AUTENTIKASI & LOGIN BERBASIS SHEET "DataUser"
 */
function checkLogin(username, password) {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName("DataUser");
  
  if (!sheet) {
    setupDatabaseSheets();
    sheet = ss.getSheetByName("DataUser");
  }
  
  if (sheet) {
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      // Baca Kolom A: No, B: Username, C: Password, D: Roll, E: Nama Guru, F: NIP
      const data = sheet.getRange(2, 1, lastRow - 1, 6).getValues();
      for (let i = 0; i < data.length; i++) {
        const u = String(data[i][1] || '').trim();
        const p = String(data[i][2] || '').trim();
        if (u === username && p === password) {
          const role = String(data[i][3] || '').trim() || "Guru";
          let namaGuru = String(data[i][4] || '').trim();
          let nip = String(data[i][5] || '').trim();

          // Jika namaGuru belum diisi pada sheet DataUser, cari berdasarkan DataMuridGuru
          if (!namaGuru) {
            const sheetMG = ss.getSheetByName("DataMuridGuru");
            if (sheetMG && sheetMG.getLastRow() > 1) {
              const dataMG = sheetMG.getRange(2, 6, sheetMG.getLastRow() - 1, 2).getValues();
              for (let j = 0; j < dataMG.length; j++) {
                const gNama = String(dataMG[j][0] || '').trim();
                const gNip = String(dataMG[j][1] || '').trim();
                if (gNama.toLowerCase() === u.toLowerCase()) {
                  namaGuru = gNama;
                  if (!nip) nip = gNip;
                  break;
                }
              }
            }
          }

          if (!namaGuru && role.toLowerCase() === 'admin') {
            namaGuru = "Administrator";
          }

          return {
            success: true,
            message: "Login Berhasil",
            username: u,
            role: role,
            namaGuru: namaGuru || u,
            nip: nip
          };
        }
      }
    }
  }
  
  // Default Fallback jika tabel login kosong / belum dikonfigurasi
  if (username === "admin" && password === "admin123") {
    return {
      success: true,
      message: "Login Administrator Default Berhasil",
      username: "admin",
      role: "Admin",
      namaGuru: "Administrator",
      nip: ""
    };
  }
  return { success: false, message: "Username atau Password salah!" };
}

/**
 * IMPORT EXCEL: Replace Data Murid & Guru
 */
function importDataMuridGuru(dataArray) {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName("DataMuridGuru");
  if (!sheet) {
    sheet = ss.insertSheet("DataMuridGuru");
    sheet.appendRow(["NISN", "Nama Murid", "Jenis Kelamin", "Kelas", "", "Nama Guru", "NIP"]);
  }

  // Bersihkan data lama mulai baris 2
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn() || 7;
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, lastCol).clearContent();
  }

  const rows = dataArray.map(item => {
    let nisnRaw = String(item.nisn || "").replace(/'/g, '').trim();
    if (nisnRaw.length > 0 && !isNaN(nisnRaw)) {
      nisnRaw = "'" + ("0000000000" + nisnRaw).slice(-10);
    }
    let nipRaw = String(item.nip || "").replace(/'/g, '').trim();
    if (nipRaw.length > 0) {
      nipRaw = "'" + nipRaw;
    }
    return [
      nisnRaw,
      String(item.namaMurid || "").trim(),
      String(item.jk || "").trim(),
      String(item.kelas || "").trim(),
      "",
      String(item.namaGuru || "").trim(),
      nipRaw
    ];
  });

  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
  }
  return { success: true, count: rows.length };
}

/**
 * SIMPAN JURNAL KBM & UPLOAD FOTO GOOGLE DRIVE
 */
function submitJurnal(dataJurnal) {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName("DataJurnalGlobal");
  const sheetPengaturan = ss.getSheetByName("Pengaturan");

  if (!sheet) return { success: false, message: "Sheet DataJurnalGlobal tidak ditemukan." };

  let buktiLink = dataJurnal.buktiKegiatan || "";
  
  // Proses Upload File Base64 ke Google Drive Folder
  if (dataJurnal.fileDataArray && dataJurnal.fileDataArray.length > 0) {
    try {
      let folderId = sheetPengaturan.getRange(2, 11).getValue(); // Kolom K Baris 2
      if (!folderId) {
        return { success: false, message: "Folder ID Google Drive belum diatur di menu Pengaturan (Kolom K Baris 2)!" };
      }
      
      const folder = DriveApp.getFolderById(String(folderId).trim());
      let uploadedLinks = [];

      for (let i = 0; i < dataJurnal.fileDataArray.length; i++) {
        const fData = dataJurnal.fileDataArray[i];
        const base64Data = fData.base64.indexOf(',') > -1 ? fData.base64.split(',')[1] : fData.base64;
        const blob = Utilities.newBlob(Utilities.base64Decode(base64Data), fData.mimeType, fData.name);
        const file = folder.createFile(blob);
        uploadedLinks.push(file.getUrl());
      }

      if (buktiLink) {
        uploadedLinks.push(buktiLink);
      }
      buktiLink = uploadedLinks.join(", \n");
    } catch (e) {
      return { success: false, message: "Gagal mengunggah berkas ke Google Drive: " + e.message };
    }
  }

  const jamKeString = "'" + String(dataJurnal.jamKe || "");
  sheet.appendRow([
    dataJurnal.tanggal,
    dataJurnal.namaGuru,
    dataJurnal.semester,
    dataJurnal.tahunAjaran,
    dataJurnal.mapel,
    jamKeString,
    dataJurnal.kelas,
    dataJurnal.pertemuanKe,
    dataJurnal.modelPembelajaran,
    dataJurnal.materiPembelajaran,
    dataJurnal.muridTidakHadir,
    dataJurnal.ketuntasanMateri,
    buktiLink
  ]);

  return { success: true };
}

/**
 * SIMPAN PRESENSI ABSENSI MURID
 */
function submitAbsensi(formHeader, attendanceList) {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName("HasilAbsen");
  if (!sheet) return { success: false, message: "Sheet HasilAbsen tidak ditemukan." };

  // Pastikan kolom 10 memiliki header "Nama Guru"
  if (sheet.getLastRow() >= 1) {
    const h10 = sheet.getRange(1, 10).getValue();
    if (!h10) {
      sheet.getRange(1, 10).setValue("Nama Guru");
    }
  }

  const namaGuru = String(formHeader.namaGuru || "").trim();

  const rows = attendanceList.map(item => {
    let nisnRaw = String(item.nisn || "").replace(/'/g, '').trim();
    if (nisnRaw.length > 0 && !isNaN(nisnRaw)) {
      nisnRaw = ("0000000000" + nisnRaw).slice(-10);
    }
    return [
      "'" + nisnRaw,
      item.nama,
      item.jk,
      formHeader.kelas,
      formHeader.tanggal,
      item.keterangan,
      formHeader.mapel,
      formHeader.semester,
      formHeader.tahunAjaran,
      namaGuru
    ];
  });

  if (rows.length > 0) {
    sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
  }
  return { success: true, count: rows.length };
}

/**
 * HITUNG OTOMATIS PERTEMUAN KE-BERAPA BERDASARKAN LOG SEBELUMNYA
 */
function getAutoPertemuan(namaGuru, semester, tahunAjaran, mapel, kelas) {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName("DataJurnalGlobal");
  if (!sheet) return 1;

  const data = sheet.getDataRange().getValues();
  let count = 0;
  for (let i = 1; i < data.length; i++) {
    if (
      String(data[i][1]).trim() === String(namaGuru).trim() &&
      String(data[i][2]).trim() === String(semester).trim() &&
      String(data[i][3]).trim() === String(tahunAjaran).trim() &&
      String(data[i][4]).trim() === String(mapel).trim() &&
      String(data[i][6]).trim() === String(kelas).trim()
    ) {
      count++;
    }
  }
  return count + 1;
}

/**
 * AMBIL DATA REKAP ABSEN
 */
function getRekapAbsenData() {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName("HasilAbsen");
  if (!sheet) return [];

  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  return data.slice(1).map((r, idx) => {
    let tgl = r[4];
    if (tgl instanceof Date) {
      tgl = Utilities.formatDate(tgl, Session.getScriptTimeZone(), "yyyy-MM-dd");
    }
    let nisnRaw = String(r[0] || '').replace(/'/g, '').trim();
    if (nisnRaw.length > 0 && !isNaN(nisnRaw)) {
      nisnRaw = ("0000000000" + nisnRaw).slice(-10);
    }
    return {
      rowIndex: idx + 2,
      nisn: nisnRaw,
      nama: String(r[1] || ''),
      jk: String(r[2] || ''),
      kelas: String(r[3] || ''),
      tanggal: String(tgl || ''),
      keterangan: String(r[5] || ''),
      mapel: String(r[6] || ''),
      semester: String(r[7] || ''),
      tahunAjaran: String(r[8] || ''),
      namaGuru: String(r[9] || '').trim()
    };
  });
}

/**
 * UPDATE DATA REKAP ABSEN
 */
function updateRekapAbsen(data) {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName("HasilAbsen");
  if (!sheet) return { success: false, message: "Sheet HasilAbsen tidak ditemukan." };

  const rowIndex = parseInt(data.rowIndex);
  if (!rowIndex || rowIndex < 2 || rowIndex > sheet.getLastRow()) {
    return { success: false, message: "Baris data presensi tidak valid." };
  }

  let nisnRaw = String(data.nisn || '').replace(/'/g, '').trim();
  if (nisnRaw.length > 0 && !isNaN(nisnRaw)) {
    nisnRaw = "'" + ("0000000000" + nisnRaw).slice(-10);
  }

  sheet.getRange(rowIndex, 1, 1, 10).setValues([[
    nisnRaw,
    String(data.nama || '').trim(),
    String(data.jk || '').trim(),
    String(data.kelas || '').trim(),
    String(data.tanggal || '').trim(),
    String(data.keterangan || '').trim(),
    String(data.mapel || '').trim(),
    String(data.semester || '').trim(),
    String(data.tahunAjaran || '').trim(),
    String(data.namaGuru || '').trim()
  ]]);

  return { success: true, message: "Data presensi berhasil diperbarui!" };
}

/**
 * HAPUS DATA REKAP ABSEN
 */
function deleteRekapAbsen(rowIndex) {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName("HasilAbsen");
  if (!sheet) return { success: false, message: "Sheet HasilAbsen tidak ditemukan." };

  const rIdx = parseInt(rowIndex);
  if (!rIdx || rIdx < 2 || rIdx > sheet.getLastRow()) {
    return { success: false, message: "Baris data presensi tidak valid." };
  }

  sheet.deleteRow(rIdx);
  return { success: true, message: "Data presensi berhasil dihapus!" };
}

/**
 * AMBIL DATA HASIL JURNAL
 */
function getHasilJurnalData() {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName("DataJurnalGlobal");
  if (!sheet) return [];

  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  return data.slice(1).map((r, idx) => {
    let tgl = r[0];
    if (tgl instanceof Date) {
      tgl = Utilities.formatDate(tgl, Session.getScriptTimeZone(), "yyyy-MM-dd");
    }
    return {
      rowIndex: idx + 2,
      tanggal: String(tgl || ''),
      namaGuru: String(r[1] || ''),
      semester: String(r[2] || ''),
      tahunAjaran: String(r[3] || ''),
      mapel: String(r[4] || ''),
      jamKe: String(r[5] || '').replace(/'/g, ''),
      kelas: String(r[6] || ''),
      pertemuanKe: String(r[7] || ''),
      modelPembelajaran: String(r[8] || ''),
      materi: String(r[9] || ''),
      muridTidakHadir: String(r[10] || ''),
      ketuntasan: String(r[11] || ''),
      bukti: String(r[12] || '')
    };
  });
}

/**
 * UPDATE DATA HASIL JURNAL
 * Mendukung penggantian berkas di Google Drive: jika ada berkas baru diunggah,
 * berkas/folder bukti lama di Google Drive otomatis dihapus dan digantikan berkas baru.
 */
function updateJurnal(data) {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName("DataJurnalGlobal");
  if (!sheet) return { success: false, message: "Sheet DataJurnalGlobal tidak ditemukan." };

  const rowIndex = parseInt(data.rowIndex);
  if (!rowIndex || rowIndex < 2 || rowIndex > sheet.getLastRow()) {
    return { success: false, message: "Baris data jurnal tidak valid." };
  }

  // Ambil link bukti lama dari baris sheet (Kolom 13 / M)
  const oldBuktiFromSheet = String(sheet.getRange(rowIndex, 13).getValue() || '').trim();
  let buktiLink = String(data.buktiKegiatan || '').trim();

  // Jika ada file baru yang diunggah
  if (data.fileDataArray && data.fileDataArray.length > 0) {
    try {
      const folderId = getDriveFolderId();
      if (!folderId) {
        return { success: false, message: "Folder ID Google Drive belum diatur di menu Pengaturan (Kolom K)!" };
      }

      // 1. HAPUS BERKAS / FOLDER LAMA DI GOOGLE DRIVE (JIKA BUKAN ROOT FOLDER)
      const targetUrlsToDelete = oldBuktiFromSheet || data.oldBuktiKegiatan || '';
      if (targetUrlsToDelete) {
        const idMatches = targetUrlsToDelete.match(/(?:id=|file\/d\/|folders\/)([a-zA-Z0-9_-]{25,})/g);
        if (idMatches) {
          idMatches.forEach(function(matched) {
            const cleanId = matched.replace(/(?:id=|file\/d\/|folders\/)/, '').trim();
            // PENTING: Jangan pernah menghapus folder root utama jurnal
            if (cleanId && cleanId !== folderId) {
              try {
                DriveApp.getFileById(cleanId).setTrashed(true);
              } catch (eFile) {
                try {
                  DriveApp.getFolderById(cleanId).setTrashed(true);
                } catch (eFolder) {}
              }
            }
          });
        }
      }

      // 2. UNGGAH BERKAS BARU KE GOOGLE DRIVE
      const folder = DriveApp.getFolderById(folderId);
      let uploadedLinks = [];
      for (let i = 0; i < data.fileDataArray.length; i++) {
        const fData = data.fileDataArray[i];
        const base64Data = fData.base64.indexOf(',') > -1 ? fData.base64.split(',')[1] : fData.base64;
        const blob = Utilities.newBlob(Utilities.base64Decode(base64Data), fData.mimeType, fData.name);
        const file = folder.createFile(blob);
        uploadedLinks.push(file.getUrl());
      }

      buktiLink = uploadedLinks.join(", \n");
    } catch (e) {
      return { success: false, message: "Gagal memproses berkas Google Drive: " + e.message };
    }
  }

  const jamKeString = "'" + String(data.jamKe || "");
  sheet.getRange(rowIndex, 1, 1, 13).setValues([[
    String(data.tanggal || ''),
    String(data.namaGuru || ''),
    String(data.semester || ''),
    String(data.tahunAjaran || ''),
    String(data.mapel || ''),
    jamKeString,
    String(data.kelas || ''),
    String(data.pertemuanKe || ''),
    String(data.modelPembelajaran || ''),
    String(data.materiPembelajaran || data.materi || ''),
    String(data.muridTidakHadir || ''),
    String(data.ketuntasanMateri || data.ketuntasan || ''),
    buktiLink
  ]]);

  return { success: true, message: "Data jurnal KBM berhasil diperbarui dan berkas Drive disinkronkan!" };
}

/**
 * HAPUS DATA HASIL JURNAL
 */
function deleteJurnal(rowIndex) {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName("DataJurnalGlobal");
  if (!sheet) return { success: false, message: "Sheet DataJurnalGlobal tidak ditemukan." };

  const rIdx = parseInt(rowIndex);
  if (!rIdx || rIdx < 2 || rIdx > sheet.getLastRow()) {
    return { success: false, message: "Baris data jurnal tidak valid." };
  }

  sheet.deleteRow(rIdx);
  return { success: true, message: "Data jurnal KBM berhasil dihapus!" };
}

/**
 * MANAJEMEN PENGGUNA (CRUD AKUN GURU & ADMIN PADA SHEET "DataUser")
 * Format Kolom: A: No, B: Username, C: Password, D: Roll, E: Nama Guru, F: NIP
 */
function getAllUsers() {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName("DataUser");
  if (!sheet) {
    setupDatabaseSheets();
    sheet = ss.getSheetByName("DataUser");
  }
  if (!sheet) return [];

  const lr = sheet.getLastRow();
  if (lr <= 1) return [];

  const data = sheet.getRange(2, 1, lr - 1, 6).getValues();
  return data.filter(r => r[1]).map((r, i) => ({
    no: r[0] || (i + 1),
    username: String(r[1] || '').trim(),
    password: String(r[2] || '').trim(),
    role: String(r[3] || 'Guru').trim(),
    namaGuru: String(r[4] || '').trim(),
    nip: String(r[5] || '').replace(/'/g, '').trim()
  }));
}

function saveUser(oldUsername, newUsername, password, role, namaGuru, nip) {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName("DataUser");
  if (!sheet) {
    setupDatabaseSheets();
    sheet = ss.getSheetByName("DataUser");
  }
  if (!sheet) return { success: false, message: "Sheet DataUser tidak ditemukan." };

  namaGuru = namaGuru ? String(namaGuru).trim() : "";
  nip = nip ? String(nip).trim() : "";
  const nipVal = nip ? "'" + nip.replace(/'/g, '') : "";

  const lr = sheet.getLastRow();
  if (oldUsername && lr > 1) {
    // Mode Edit: cari berdasarkan oldUsername di Kolom B
    const data = sheet.getRange(2, 2, lr - 1, 1).getValues();
    for (let i = 0; i < data.length; i++) {
      if (String(data[i][0]).trim() === oldUsername) {
        const rowNum = i + 2;
        sheet.getRange(rowNum, 2, 1, 5).setValues([[newUsername, password, role, namaGuru, nipVal]]);
        return { success: true, message: "Data pengguna berhasil diperbarui di sheet DataUser!" };
      }
    }
  } 

  // Mode Tambah Baru: cek username kembar
  if (lr > 1) {
    const existingUsers = sheet.getRange(2, 2, lr - 1, 1).getValues();
    for (let i = 0; i < existingUsers.length; i++) {
      if (String(existingUsers[i][0]).trim() === newUsername) {
        return { success: false, message: "Username '" + newUsername + "' sudah terdaftar!" };
      }
    }
  }

  const nextNo = lr > 1 ? lr : 1;
  sheet.appendRow([nextNo, newUsername, password, role, namaGuru, nipVal]);
  return { success: true, message: "Pengguna baru berhasil disimpan ke sheet DataUser!" };
}

function deleteUser(username) {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName("DataUser");
  if (!sheet) return { success: false, message: "Sheet DataUser tidak ditemukan." };

  if (String(username || '').trim().toLowerCase() === 'admin') {
    return { success: false, message: "Akun Administrator utama ('admin') dilindungi sistem dan tidak dapat dihapus." };
  }

  const lr = sheet.getLastRow();
  if (lr <= 1) return { success: false, message: "Tidak ada data pengguna." };

  const data = sheet.getRange(2, 2, lr - 1, 1).getValues();
  for (let i = 0; i < data.length; i++) {
    if (String(data[i][0]).trim() === username) {
      sheet.deleteRow(i + 2);
      // Re-number No di kolom A
      const newLr = sheet.getLastRow();
      if (newLr > 1) {
        for (let r = 2; r <= newLr; r++) {
          sheet.getRange(r, 1).setValue(r - 1);
        }
      }
      return { success: true, message: "Pengguna berhasil dihapus dari sheet DataUser!" };
    }
  }
  return { success: false, message: "Pengguna tidak ditemukan." };
}

/**
 * IMPORT EXCEL PENGGUNA (DATA USER)
 * Skenario: Data lama digantikan data baru dari Excel, KECUALI akun Admin tetap dipertahankan dan dilindungi.
 */
function importUsersFromExcel(usersArray) {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName("DataUser");
  if (!sheet) {
    setupDatabaseSheets();
    sheet = ss.getSheetByName("DataUser");
  }
  if (!sheet) return { success: false, message: "Sheet DataUser tidak ditemukan." };

  // 1. Ambil akun Admin lama yang sudah ada di sheet DataUser
  const lr = sheet.getLastRow();
  let existingAdmins = [];
  if (lr > 1) {
    const currentData = sheet.getRange(2, 1, lr - 1, 6).getValues();
    existingAdmins = currentData.filter(r => r[1] && String(r[3] || '').trim().toLowerCase() === 'admin');
  }

  // Jika belum ada admin sama sekali, buat admin bawaan sistem
  if (existingAdmins.length === 0) {
    existingAdmins = [[1, "admin", "admin123", "Admin", "Administrator", ""]];
  }

  // 2. Filter input usersArray agar tidak dapat mengimpor / mengubah akun Admin dari Excel
  const validNewUsers = (usersArray || []).filter(u => {
    const uname = String(u.username || '').trim();
    const role = String(u.role || 'Guru').trim().toLowerCase();
    return uname && role !== 'admin';
  });

  // 3. Gabungkan Admin lama + User Guru baru
  const finalRows = [];
  let noCounter = 1;

  // Masukkan admin yang dipertahankan
  existingAdmins.forEach(adm => {
    finalRows.push([
      noCounter++,
      String(adm[1]).trim(),
      String(adm[2]).trim(),
      "Admin",
      String(adm[4] || 'Administrator').trim(),
      String(adm[5] || '').trim() ? ("'" + String(adm[5]).replace(/'/g, '').trim()) : ""
    ]);
  });

  // Masukkan pengguna hasil import
  validNewUsers.forEach(u => {
    const nipVal = u.nip ? ("'" + String(u.nip).replace(/'/g, '').trim()) : "";
    finalRows.push([
      noCounter++,
      String(u.username).trim(),
      String(u.password || '123456').trim(),
      String(u.role || 'Guru').trim(),
      String(u.namaGuru || '').trim(),
      nipVal
    ]);
  });

  // 4. Hapus data lama (mulai baris 2) dan tulis data gabungan baru
  if (lr > 1) {
    sheet.getRange(2, 1, lr - 1, 6).clearContent();
  }

  if (finalRows.length > 0) {
    sheet.getRange(2, 1, finalRows.length, 6).setValues(finalRows);
  }

  return {
    success: true,
    count: validNewUsers.length,
    message: `Berhasil mengimpor ${validNewUsers.length} data pengguna. Akun Administrator tetap dipertahankan.`
  };
}

/**
 * AMBIL PENGATURAN SISTEM SECARA DETAIL UNTUK EDITING
 */
function getPengaturanData() {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName("Pengaturan");
  if (!sheet) {
    setupDatabaseSheets();
    sheet = ss.getSheetByName("Pengaturan");
  }
  if (!sheet) {
    return {
      namaSekolah: "",
      logoUrl: "",
      kopSurat: "",
      linkHasilAbsen: "",
      linkHasilJurnal: "",
      folderIdDrive: "",
      mapelList: [],
      kelasList: [],
      taList: []
    };
  }

  const data = sheet.getDataRange().getValues();
  let namaSekolah = "";
  let logoUrl = "";
  let kopSurat = "";
  let mapelList = [];
  let kelasList = [];
  let taList = [];
  let linkHasilAbsen = "";
  let linkHasilJurnal = "";
  let folderIdDrive = "";

  if (data.length > 1) {
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] && !namaSekolah) namaSekolah = String(data[i][0]).trim();
      if (data[i][1] && !logoUrl) logoUrl = String(data[i][1]).trim();
      if (data[i][2]) mapelList.push(String(data[i][2]).trim());
      if (data[i][3]) kelasList.push(String(data[i][3]).trim());
      if (data[i][4]) taList.push(String(data[i][4]).trim());
      if (data[i][5] && !kopSurat) kopSurat = String(data[i][5]).trim();
      if (data[i][8] && !linkHasilAbsen) linkHasilAbsen = String(data[i][8]).trim();
      if (data[i][9] && !linkHasilJurnal) linkHasilJurnal = String(data[i][9]).trim();
      if (data[i][10] && !folderIdDrive) folderIdDrive = String(data[i][10]).trim();
    }
  }

  return {
    namaSekolah,
    logoUrl,
    kopSurat,
    linkHasilAbsen,
    linkHasilJurnal,
    folderIdDrive,
    mapelList: [...new Set(mapelList)].filter(Boolean),
    kelasList: [...new Set(kelasList)].filter(Boolean),
    taList: [...new Set(taList)].filter(Boolean)
  };
}

/**
 * SIMPAN PERUBAHAN PADA SHEET PENGATURAN
 */
function savePengaturanData(payload) {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName("Pengaturan");
  if (!sheet) {
    sheet = ss.insertSheet("Pengaturan");
    sheet.appendRow(["Nama Sekolah", "URL Logo Sekolah", "Mata Pelajaran", "Kelas", "Tahun Ajaran", "Kop Surat", "", "", "Link Hasil Absen", "Link Hasil Jurnal", "Folder ID Drive"]);
  }

  const lr = sheet.getLastRow();
  if (lr > 1) {
    sheet.getRange(2, 1, lr - 1, 11).clearContent();
  }

  const mapels = (payload.mapelList || []).filter(Boolean);
  const kelass = (payload.kelasList || []).filter(Boolean);
  const tas = (payload.taList || []).filter(Boolean);
  const maxRows = Math.max(1, mapels.length, kelass.length, tas.length);

  const rows = [];
  for (let i = 0; i < maxRows; i++) {
    rows.push([
      i === 0 ? String(payload.namaSekolah || '').trim() : '',
      i === 0 ? String(payload.logoUrl || '').trim() : '',
      mapels[i] ? String(mapels[i]).trim() : '',
      kelass[i] ? String(kelass[i]).trim() : '',
      tas[i] ? String(tas[i]).trim() : '',
      i === 0 ? String(payload.kopSurat || '').trim() : '',
      '',
      '',
      i === 0 ? String(payload.linkHasilAbsen || '').trim() : '',
      i === 0 ? String(payload.linkHasilJurnal || '').trim() : '',
      i === 0 ? String(payload.folderIdDrive || '').trim() : ''
    ]);
  }

  sheet.getRange(2, 1, rows.length, 11).setValues(rows);
  return { success: true, message: "Pengaturan sistem berhasil disimpan ke sheet Pengaturan!" };
}