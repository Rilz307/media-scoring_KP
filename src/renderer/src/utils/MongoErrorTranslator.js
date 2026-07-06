/**
 * Translates raw MongoDB/Network errors into user-friendly Indonesian messages
 * and specific error categories.
 * @param {string|Error} error The original error message or object.
 * @returns {object} An object containing the friendly title, description, original error string, and errorType.
 */
export function translateMongoError(error) {
  const errString = typeof error === 'string' ? error : error?.message || String(error)

  const result = {
    title: 'Koneksi Gagal',
    description:
      'Terjadi kesalahan saat menghubungkan ke database. Periksa koneksi internet Anda atau hubungi Administrator.',
    original: errString,
    errorType: 'FAILED'
  }

  const lowerErr = errString.toLowerCase()

  if (lowerErr.includes('enotfound') || lowerErr.includes('getaddrinfo')) {
    result.title = 'Alamat Tidak Ditemukan'
    result.description =
      'Aplikasi tidak dapat menemukan alamat server database. Pastikan perangkat Anda terhubung ke internet dan URL/URI yang dimasukkan sudah benar.'
    result.errorType = 'NETWORK_ERROR'
  } else if (lowerErr.includes('bad auth') || lowerErr.includes('authentication failed')) {
    result.title = 'Autentikasi Gagal'
    result.description =
      'Username atau password database salah. Harap periksa kembali detail kredensial (username/password) di dalam URI koneksi Anda.'
    result.errorType = 'AUTH_FAILED'
  } else if (
    lowerErr.includes('ip not on whitelist') ||
    lowerErr.includes('could not connect') ||
    lowerErr.includes('econnrefused')
  ) {
    result.title = 'Akses Ditolak (IP Belum Diizinkan)'
    result.description =
      'Koneksi ditolak oleh server. Pastikan Network Access (IP Whitelist) di pengaturan MongoDB Atlas sudah diatur menjadi "Allow Access From Anywhere" (0.0.0.0/0) atau memasukkan IP perangkat ini.'
    result.errorType = 'SERVER_UNREACHABLE'
  } else if (lowerErr.includes('timeout') || lowerErr.includes('server selection timed out')) {
    result.title = 'Koneksi Terputus (Timeout)'
    result.description =
      'Waktu permintaan koneksi habis. Jaringan internet mungkin terlalu lambat, atau server sedang tidak dapat diakses.'
    result.errorType = 'NETWORK_ERROR'
  } else if (lowerErr.includes('invalid scheme') || lowerErr.includes('invalid uri')) {
    result.title = 'Format URL Tidak Valid'
    result.description =
      'Format URI koneksi tidak dikenali. Pastikan URL diawali dengan "mongodb://" atau "mongodb+srv://".'
    result.errorType = 'INVALID_FORMAT'
  }

  return result
}
