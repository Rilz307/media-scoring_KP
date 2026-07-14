/**
 * Official Assessment Criteria Configuration
 *
 * Sourced directly from official Kominfo DOCX templates and PERWALI Kota Kendari Nomor 36 Tahun 2023.
 * All wording, typos, and formatting match the official forms exactly.
 */

export const criteriaVersion = 4

export const mediaCriteria = {
  SIBER: [
    {
      id: 'section_siber_main',
      title: '',
      questions: [
        {
          id: 'siber_q1',
          label: 'ANALISIS DIGITAL WEB/GOOGLE ANALYTICS',
          required: true,
          options: [
            { value: 'siber_q1_opt1', label: 'Ada', points: 12 },
            { value: 'siber_q1_opt2', label: 'Tidak ada', points: 0 }
          ]
        },
        {
          id: 'siber_q2',
          label: 'USIA WEB',
          required: true,
          options: [
            { value: 'siber_q2_opt1', label: '1-2 tahun', points: 0 },
            { value: 'siber_q2_opt2', label: '2,1-4 tahun', points: 4 },
            { value: 'siber_q2_opt3', label: '4,1-6 tahun', points: 6 },
            { value: 'siber_q2_opt4', label: '6,1-8 tahun', points: 8 },
            { value: 'siber_q2_opt5', label: '>8 tahun', points: 12 }
          ]
        },
        {
          id: 'siber_q3',
          label: 'WEB/HALAMAN',
          required: true,
          options: [
            { value: 'siber_q3_opt1', label: 'Web khusus Kota Kendari', points: 6 },
            { value: 'siber_q3_opt2', label: 'Halaman khusus Kota Kendari', points: 4 }
          ]
        },
        {
          id: 'siber_q4',
          label: 'TERDAFTAR DIDEWAN PERS',
          required: true,
          options: [
            {
              value: 'siber_q4_opt1',
              label: 'Terverifikasi administrasi dan faktual',
              points: 12
            },
            { value: 'siber_q4_opt2', label: 'Terverifikasi administrasi', points: 8 },
            { value: 'proses_pendaftaran', label: 'Proses Pendaftaran', points: 6 },
            { value: 'siber_q4_opt3', label: 'Tidak terverifikasi', points: 0 }
          ]
        },
        {
          id: 'siber_q5',
          label: 'MASA EXPIRED/KADARLUASA WEB',
          required: true,
          options: [
            { value: 'siber_q5_opt1', label: '1 tahun', points: 4 },
            { value: 'siber_q5_opt2', label: '2 tahun', points: 8 },
            { value: 'siber_q5_opt3', label: '3 tahun atau lebih', points: 12 }
          ]
        },
        {
          id: 'siber_q6',
          label: 'STATUS WARTAWAN ATAU BIRO',
          required: true,
          options: [
            { value: 'siber_q6_opt1', label: 'Ada khusus Kota Kendari', points: 12 },
            { value: 'siber_q6_opt2', label: 'Anda merangkap dengan daerah lain', points: 6 },
            { value: 'siber_q6_opt3', label: 'Tidak ada', points: 4 }
          ]
        },
        {
          id: 'siber_q7',
          label: 'PEMIMPIN REDAKSI/ PENANGGUNG JAWAB MEMILIKI KOPENTENSI TINGKAT UTAMA',
          required: true,
          options: [
            { value: 'siber_q7_opt1', label: 'Sudah', points: 12 },
            { value: 'siber_q7_opt2', label: 'Belum', points: 0 }
          ]
        },
        {
          id: 'siber_q8',
          label: 'UPDATE BERITA UMUM SAAT PENGAJUAN(disesuaikan)',
          required: true,
          options: [
            { value: 'siber_q8_opt1', label: 'Sudah', points: 12 },
            { value: 'siber_q8_opt2', label: 'Belum', points: 0 }
          ]
        },
        {
          id: 'siber_q9',
          label: 'UPDATE BERITA KOTA KENDARI SAAT PENGAJUAN',
          required: true,
          options: [
            { value: 'siber_q9_opt1', label: 'Ada', points: 12 },
            { value: 'siber_q9_opt2', label: 'Tidak ada', points: 0 }
          ]
        }
      ]
    }
  ],
  CETAK: [
    {
      id: 'section_cetak_main',
      title: '',
      questions: [
        {
          id: 'cetak_q1',
          label: 'CAKUPAN MEDIA',
          required: true,
          options: [
            { value: 'cetak_q1_opt1', label: 'Nasional/regisional 1 provinsi', points: 12 },
            { value: 'cetak_q1_opt2', label: 'Kabupaten', points: 8 }
          ]
        },
        {
          id: 'cetak_q2',
          label: 'BERITA KHUSUS KOTA KENDARI',
          required: true,
          options: [
            { value: 'cetak_q2_opt1', label: 'Harian', points: 4 },
            { value: 'cetak_q2_opt2', label: 'Mingguan', points: 12 },
            { value: 'cetak_q2_opt3', label: 'Bulanan', points: 8 },
            { value: 'cetak_q2_opt4', label: 'Tidak ada', points: 4 }
          ]
        },
        {
          id: 'cetak_q3',
          label: 'SEBARAN OPLAH',
          required: true,
          options: [
            { value: 'cetak_q3_opt1', label: 'Nasional/regional', points: 0 },
            { value: 'cetak_q3_opt2', label: 'Provinsi', points: 12 },
            { value: 'cetak_q3_opt3', label: 'Kabupaten', points: 8 }
          ]
        },
        {
          id: 'cetak_q4',
          label: 'SEBARAN OPLAH DI KOTA KENDARI',
          required: true,
          options: [
            { value: 'cetak_q4_opt1', label: '15-22 kecamatan', points: 4 },
            { value: 'cetak_q4_opt2', label: '8-14 kecamatan', points: 12 },
            { value: 'cetak_q4_opt3', label: 'S.d 7 kecamatan', points: 8 }
          ]
        },
        {
          id: 'cetak_q5',
          label: 'STATUS WARRTAWAN/BIRO',
          required: true,
          options: [
            { value: 'cetak_q5_opt1', label: 'Ada', points: 8 },
            { value: 'cetak_q5_opt2', label: 'Tidak ada', points: 4 }
          ]
        },
        {
          id: 'cetak_q6',
          label: 'PEMIMPIN REDAKSI/PENANGGUNG G JAWAB MEMILIKI KOMPENTENSI WARTAWAN UTAMA',
          required: true,
          options: [
            { value: 'cetak_q6_opt1', label: 'Ada', points: 12 },
            { value: 'cetak_q6_opt2', label: 'Tidak', points: 0 }
          ]
        },
        {
          id: 'cetak_q7',
          label: 'TERDAPAT DI DEWAN PERS',
          required: true,
          options: [
            { value: 'cetak_q7_opt1', label: 'Terdaftar administrasi dan faktual', points: 12 },
            { value: 'cetak_q7_opt2', label: 'Terdaftar administrasi', points: 8 },
            { value: 'cetak_q7_opt3', label: 'Tidak terdaftar', points: 0 }
          ]
        },
        {
          id: 'cetak_q8',
          label: 'KANTOR/BIRO/SEKRETARIAT BERSAMA',
          required: true,
          options: [
            { value: 'cetak_q8_opt1', label: 'Ada', points: 12 },
            { value: 'cetak_q8_opt2', label: 'Tidak', points: 0 }
          ]
        },
        {
          id: 'cetak_q9',
          label: 'Frekuensi penerbitan',
          required: true,
          options: [
            { value: 'cetak_q9_opt1', label: '1 kali sehari', points: 12 },
            { value: 'cetak_q9_opt2', label: '4 kali sehari', points: 8 },
            { value: 'cetak_q9_opt3', label: '2 kali sehari', points: 4 }
          ]
        }
      ]
    }
  ],
  ELEKTRONIK: [
    {
      id: 'section_elek_main',
      title: '',
      questions: [
        {
          id: 'elek_q1',
          label: 'CAKUPAN SIARAN',
          required: true,
          options: [
            { value: 'elek_q1_opt1', label: '15-21 Kecamaatan', points: 12 },
            { value: 'elek_q1_opt2', label: '8-14 Kecamatan', points: 8 },
            { value: 'elek_q1_opt3', label: 's.d 7kecamatan', points: 4 }
          ]
        },
        {
          id: 'elek_q2',
          label: 'WARTAWAN/REPORTER TETAP',
          required: true,
          options: [
            { value: 'elek_q2_opt1', label: 'Ada', points: 6 },
            { value: 'elek_q2_opt2', label: 'Tidak', points: 0 }
          ]
        },
        {
          id: 'elek_q3',
          label:
            'PEMIMPIN REDAKSI/ PENANGGUNG JAWAB MEMILIKI KOMPENTENSI (UKW) TINGGAT UTAMA/P3SPS',
          required: true,
          options: [
            { value: 'elek_q3_opt1', label: 'Sudah', points: 6 },
            { value: 'elek_q3_opt2', label: 'belum', points: 0 }
          ]
        }
      ]
    }
  ]
}

export default mediaCriteria
