/**
 * pdfTemplateMap.js
 *
 * Presentation-layer mapping configuration for PDF generation.
 * This file keeps PDF-specific layout metadata decoupled from the assessment domain (mediaCriteria.js).
 */

export const pdfTemplateMap = {
  // CETAK layout uses 5 columns: NO | URAIKAN KRITERIA | SUB URAINKAN | STATUS | CEKLIS PADA
  CETAK: {
    cetak_q1: {
      options: {
        cetak_q1_opt1: { subUraian: 'Nasional/Regisional', status: '' },
        cetak_q1_opt2: { subUraian: 'Provinsi', status: '' },
        cetak_q1_opt3: { subUraian: 'Kabupaten', status: '' }
      }
    },
    cetak_q2: {
      options: {
        cetak_q2_opt1: { subUraian: '1 Halaman', status: '' },
        cetak_q2_opt2: { subUraian: '½ Halaman', status: '' },
        cetak_q2_opt3: { subUraian: '¼ Halaman', status: '' },
        cetak_q2_opt4: { subUraian: 'Tidak Ada', status: '' }
      }
    },
    cetak_q3: {
      options: {
        cetak_q3_opt1: { subUraian: 'Nasional/Regional', status: '' },
        cetak_q3_opt2: { subUraian: 'Provinsi', status: '' },
        cetak_q3_opt3: { subUraian: 'Kabupaten', status: '' }
      }
    },
    cetak_q4: {
      options: {
        cetak_q4_opt1: { subUraian: '15-21 Kecamatan', status: '' },
        cetak_q4_opt2: { subUraian: '8-14 Kecamatan', status: '' },
        cetak_q4_opt3: { subUraian: 's.d 7 Kecamatan', status: '' }
      }
    },
    cetak_q5: {
      options: {
        cetak_q5_opt1: { subUraian: 'Untuk Kota Kendari', status: 'Ada' },
        cetak_q5_opt2: { subUraian: 'Untuk Kota Kendari', status: 'Tidak Ada' }
      }
    },
    cetak_q6: {
      options: {
        cetak_q6_opt1: { subUraian: 'Bukti sertifikat UKW', status: 'Ada' },
        cetak_q6_opt2: { subUraian: 'Bukti sertifikat UKW', status: 'Tidak Ada' }
      }
    },
    cetak_q7: {
      options: {
        cetak_q7_opt1: { subUraian: '', status: 'Terdaftar' },
        cetak_q7_opt2: { subUraian: '', status: 'Tidak Terdaftar' }
      }
    },
    cetak_q8: {
      options: {
        cetak_q8_opt1: { subUraian: 'Biro Kota Kendari', status: 'Ada' },
        cetak_q8_opt2: { subUraian: 'Biro Kota Kendari', status: 'Tidak Ada' }
      }
    },
    cetak_q9: {
      options: {
        cetak_q9_opt1: { subUraian: '1 Kali Sehari', status: '' },
        cetak_q9_opt2: { subUraian: '4 Kali Sebulan', status: '' },
        cetak_q9_opt3: { subUraian: '2 Kali Sebulan', status: '' }
      }
    }
  },

  // SIBER and ELEKTRONIK generally use 4 columns where the option maps directly to 'FAKTOR VERIFIKASI'.
  SIBER: {},
  ELEKTRONIK: {}
}

export default pdfTemplateMap
