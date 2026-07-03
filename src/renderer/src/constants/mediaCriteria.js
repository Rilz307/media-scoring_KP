/**
 * Official Assessment Criteria Configuration
 *
 * Sourced directly from official Kominfo DOCX templates.
 * All wording, typos, and formatting match the official forms exactly.
 * Point values are placeholders and will be finalized with Kominfo.
 */

export const criteriaVersion = 2

export const mediaCriteria = {
  SIBER: [
    {
      id: 'section_siber_main',
      title: '', // No official section title in DOCX
      questions: [
        {
          id: 'siber_q1',
          label: 'ANALISIS DIGITAL WEB/GOOGLE ANALITYC',
          required: true,
          options: [
            { value: 'siber_q1_opt1', label: 'Ada', points: 100 },
            { value: 'siber_q1_opt2', label: 'Tidak Ada', points: 0 }
          ]
        },
        {
          id: 'siber_q2',
          label: 'USIA WEB',
          required: true,
          options: [
            { value: 'siber_q2_opt1', label: '1-2 Tahun', points: 20 },
            { value: 'siber_q2_opt2', label: '2,1-4 Tahun', points: 40 },
            { value: 'siber_q2_opt3', label: '4,1-6 Tahun', points: 60 },
            { value: 'siber_q2_opt4', label: '6,1-8 Tahun', points: 80 },
            { value: 'siber_q2_opt5', label: '>8 Tahun', points: 100 }
          ]
        },
        {
          id: 'siber_q3',
          label: 'WEB/HALAMAN',
          required: true,
          options: [
            { value: 'siber_q3_opt1', label: 'Ada Web Khusus kota kendari', points: 100 },
            { value: 'siber_q3_opt2', label: 'Ada Halaman khusus kota kendari', points: 50 },
            { value: 'siber_q3_opt3', label: 'Tanpa Halaman kota kendari', points: 0 }
          ]
        },
        {
          id: 'siber_q4',
          label: 'TERDAFTAR DI DEWAN PERS',
          required: true,
          options: [
            {
              value: 'siber_q4_opt1',
              label: 'Terverifikasi administrasi dan faktual',
              points: 100
            },
            { value: 'siber_q4_opt2', label: 'Terverifikasi administrasi', points: 50 },
            { value: 'siber_q4_opt3', label: 'Proses Pendaftaran', points: 25 }
          ]
        },
        {
          id: 'siber_q5',
          label: 'MASA EXPIRED/KADALUWARSA WEBSITE',
          required: true,
          options: [
            { value: 'siber_q5_opt1', label: '1 tahun', points: 25 },
            { value: 'siber_q5_opt2', label: '2 tahun', points: 50 },
            { value: 'siber_q5_opt3', label: '3 tahun atau lebih', points: 100 }
          ]
        },
        {
          id: 'siber_q6',
          label: 'STATUS WARTAWAN/BIRO',
          required: true,
          options: [
            { value: 'siber_q6_opt1', label: 'Ada khusus Kota Kendari', points: 100 },
            { value: 'siber_q6_opt2', label: 'Ada merangkap dengan daerah lain', points: 50 },
            { value: 'siber_q6_opt3', label: 'Tidak ada', points: 0 }
          ]
        },
        {
          id: 'siber_q7',
          label: 'PEMIMPIN REDAKSI/ PENANGGUNG JAWAB MEMILIKI SERTIFIKAT KOMPENTENSI TINGKAT UTAMA',
          required: true,
          options: [
            { value: 'siber_q7_opt1', label: 'Sudah', points: 100 },
            { value: 'siber_q7_opt2', label: 'Belum', points: 0 }
          ]
        },
        {
          id: 'siber_q8',
          label: 'UPDATE BERITA UMUM RUTIN MINIMAL 1 KALI SEHARI',
          required: true,
          options: [
            { value: 'siber_q8_opt1', label: 'Ada', points: 100 },
            { value: 'siber_q8_opt2', label: 'Tidak ada', points: 0 }
          ]
        },
        {
          id: 'siber_q9',
          label: 'UPDATE BERITA KOTA KENDARI SAAT INI 1 KALI SEHARI',
          required: true,
          options: [
            { value: 'siber_q9_opt1', label: 'Ada', points: 100 },
            { value: 'siber_q9_opt2', label: 'Tidak Ada', points: 0 }
          ]
        }
      ]
    }
  ],
  CETAK: [
    {
      id: 'section_cetak_main',
      title: '', // No official section title in DOCX
      questions: [
        {
          id: 'cetak_q1',
          label: 'CAKUPAN MEDIA',
          required: true,
          options: [
            { value: 'cetak_q1_opt1', label: 'Nasional/Regisional', points: 100 },
            { value: 'cetak_q1_opt2', label: 'Provinsi', points: 50 },
            { value: 'cetak_q1_opt3', label: 'Kabupaten', points: 25 }
          ]
        },
        {
          id: 'cetak_q2',
          label: 'HALAMAN KHUSUS KOTA KENDARI',
          required: true,
          options: [
            { value: 'cetak_q2_opt1', label: '1 Halaman', points: 100 },
            { value: 'cetak_q2_opt2', label: '½ Halaman', points: 50 },
            { value: 'cetak_q2_opt3', label: '¼ Halaman', points: 25 },
            { value: 'cetak_q2_opt4', label: 'Tidak Ada', points: 0 }
          ]
        },
        {
          id: 'cetak_q3',
          label: 'SEBARAN OPLAH',
          required: true,
          options: [
            { value: 'cetak_q3_opt1', label: 'Nasional/Regional', points: 100 },
            { value: 'cetak_q3_opt2', label: 'Provinsi', points: 50 },
            { value: 'cetak_q3_opt3', label: 'Kabupaten', points: 25 }
          ]
        },
        {
          id: 'cetak_q4',
          label: 'SEBARAN OPLAH DI KABUPATEN',
          required: true,
          options: [
            { value: 'cetak_q4_opt1', label: '15-21 Kecamatan', points: 100 },
            { value: 'cetak_q4_opt2', label: '8-14 Kecamatan', points: 50 },
            { value: 'cetak_q4_opt3', label: 's.d 7 Kecamatan', points: 25 }
          ]
        },
        {
          id: 'cetak_q5',
          label: 'STATUS WARTAWAN/BIRO',
          required: true,
          options: [
            { value: 'cetak_q5_opt1', label: 'Ada (Untuk Kota Kendari)', points: 100 },
            { value: 'cetak_q5_opt2', label: 'Tidak Ada (Untuk Kota Kendari)', points: 0 }
          ]
        },
        {
          id: 'cetak_q6',
          label: 'PEMIMPIN REDAKSI/ PENANGGUNG JAWAB MEMILIKI KOMPETENSI WARTAWAN UTAMA',
          required: true,
          options: [
            { value: 'cetak_q6_opt1', label: 'Ada (Bukti sertifikat UKW)', points: 100 },
            { value: 'cetak_q6_opt2', label: 'Tidak Ada (Bukti sertifikat UKW)', points: 0 }
          ]
        },
        {
          id: 'cetak_q7',
          label: 'TERDAFTAR DI DEWAN PRES',
          required: true,
          options: [
            { value: 'cetak_q7_opt1', label: 'Terdaftar', points: 100 },
            { value: 'cetak_q7_opt2', label: 'Tidak Terdaftar', points: 0 }
          ]
        },
        {
          id: 'cetak_q8',
          label: 'KANTOR/BIRO',
          required: true,
          options: [
            { value: 'cetak_q8_opt1', label: 'Ada (Biro Kota Kendari)', points: 100 },
            { value: 'cetak_q8_opt2', label: 'Tidak Ada (Biro Kota Kendari)', points: 0 }
          ]
        },
        {
          id: 'cetak_q9',
          label: 'FREKUENSI PENERBITAN',
          required: true,
          options: [
            { value: 'cetak_q9_opt1', label: '1 Kali Sehari', points: 100 },
            { value: 'cetak_q9_opt2', label: '4 Kali Sebulan', points: 50 },
            { value: 'cetak_q9_opt3', label: '2 Kali Sebulan', points: 25 }
          ]
        }
      ]
    }
  ],
  ELEKTRONIK: [
    {
      id: 'section_elek_main',
      title: '', // No official section title in DOCX
      questions: [
        {
          id: 'elek_q1',
          label: 'CANGKUPAN SIARAN',
          required: true,
          options: [
            { value: 'elek_q1_opt1', label: 'NASIONAL', points: 100 },
            { value: 'elek_q1_opt2', label: 'DAERAH', points: 50 }
          ]
        },
        {
          id: 'elek_q2',
          label: 'WARTAWAN/REPORTER TETAP',
          required: true,
          options: [
            { value: 'elek_q2_opt1', label: 'Ada', points: 100 },
            { value: 'elek_q2_opt2', label: 'Tidak', points: 0 }
          ]
        },
        {
          id: 'elek_q3',
          label: 'PEMIMPIN REDAKSI/ PENANGGUNG JAWAB MEMILIKI KOMPENTENSI TINGKAT',
          required: true,
          options: [
            { value: 'elek_q3_opt1', label: 'Sudah', points: 100 },
            { value: 'elek_q3_opt2', label: 'Belum', points: 0 }
          ]
        }
      ]
    }
  ]
}

export default mediaCriteria
