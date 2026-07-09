import normalizeReport from '../../utils/ReportBuilder'
import mediaCriteria from '../../constants/mediaCriteria'

export default class RekapitulasiViewModel {
  static build(rawMediaList) {
    const normalized = rawMediaList.map((m) => normalizeReport(m, mediaCriteria))
    const groups = {
      ELEKTRONIK: normalized.filter((m) => m.jenis === 'ELEKTRONIK'),
      CETAK: normalized.filter((m) => m.jenis === 'CETAK'),
      SIBER: normalized.filter((m) => m.jenis === 'SIBER')
    }

    let rowsHtml = ''
    let counter = 1

    const renderGroup = (title, data) => {
      rowsHtml += `
        <tr class="group-header">
          <td colspan="6"><strong>${title}</strong></td>
        </tr>
      `
      if (data && data.length > 0) {
        data.forEach((m) => {
          rowsHtml += `
            <tr>
              <td class="text-center">${counter++}</td>
              <td>${m.nama_media || ''}</td>
              <td>${m.perusahaan || ''}</td>
              <td>${m.alamat || ''}</td>
              <td class="text-center">${m.totalScore || 0} Poin</td>
              <td class="text-center">${m.grade || '-'}</td>
            </tr>
          `
        })
      }
    }

    renderGroup('A. MEDIA ELEKTRONIK', groups.ELEKTRONIK)
    renderGroup('B. MEDIA CETAK', groups.CETAK)
    renderGroup('C. MEDIA SIBER', groups.SIBER)

    const dateStr = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })

    const totalMemenuhi = normalized.filter((m) => m.grade).length
    const totalTidakMemenuhi = normalized.filter((m) => !m.grade).length

    return {
      tanggalVerifikasi: dateStr,
      tableRows: rowsHtml,
      totalMedia: normalized.length,
      totalMemenuhi,
      totalTidakMemenuhi
    }
  }
}
