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
        cetak_q1_opt1: { subUraian: 'Nasional/regisional 1 provinsi', status: '' },
        cetak_q1_opt2: { subUraian: 'Kabupaten', status: '' }
      }
    },
    cetak_q2: {
      options: {
        cetak_q2_opt1: { subUraian: 'Harian', status: '' },
        cetak_q2_opt2: { subUraian: 'Mingguan', status: '' },
        cetak_q2_opt3: { subUraian: 'Bulanan', status: '' },
        cetak_q2_opt4: { subUraian: 'Tidak ada', status: '' }
      }
    },
    cetak_q3: {
      options: {
        cetak_q3_opt1: { subUraian: 'Nasional/regional', status: '' },
        cetak_q3_opt2: { subUraian: 'Provinsi', status: '' },
        cetak_q3_opt3: { subUraian: 'Kabupaten', status: '' }
      }
    },
    cetak_q4: {
      options: {
        cetak_q4_opt1: { subUraian: '15-22 kecamatan', status: '' },
        cetak_q4_opt2: { subUraian: '8-14 kecamatan', status: '' },
        cetak_q4_opt3: { subUraian: 'S.d 7 kecamatan', status: '' }
      }
    },
    cetak_q5: {
      options: {
        cetak_q5_opt1: { subUraian: 'Untuk Kota Kendari', status: 'Ada' },
        cetak_q5_opt2: { subUraian: 'Untuk Kota Kendari', status: 'Tidak ada' }
      }
    },
    cetak_q6: {
      options: {
        cetak_q6_opt1: { subUraian: 'Bukti UKW', status: 'Ada' },
        cetak_q6_opt2: { subUraian: 'Bukti UKW', status: 'Tidak' }
      }
    },
    cetak_q7: {
      options: {
        cetak_q7_opt1: { subUraian: '', status: 'Terdaftar administrasi dan faktual' },
        cetak_q7_opt2: { subUraian: '', status: 'Terdaftar administrasi' },
        cetak_q7_opt3: { subUraian: '', status: 'Tidak terdaftar' }
      }
    },
    cetak_q8: {
      options: {
        cetak_q8_opt1: { subUraian: 'Biro Kota Kendari', status: 'Ada' },
        cetak_q8_opt2: { subUraian: 'Biro Kota Kendari', status: 'Tidak' }
      }
    },
    cetak_q9: {
      options: {
        cetak_q9_opt1: { subUraian: '1 kali sehari', status: '' },
        cetak_q9_opt2: { subUraian: '4 kali sehari', status: '' },
        cetak_q9_opt3: { subUraian: '2 kali sehari', status: '' }
      }
    }
  },

  // SIBER and ELEKTRONIK generally use 4 columns where the option maps directly to 'FAKTOR VERIFIKASI'.
  SIBER: {},
  ELEKTRONIK: {}
}

export default pdfTemplateMap
