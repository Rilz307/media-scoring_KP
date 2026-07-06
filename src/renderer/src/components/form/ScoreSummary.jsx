import { useMemo } from 'react'
import { ShieldCheck } from 'lucide-react'
import mediaCriteria from '../../constants/mediaCriteria'

function ScoreSummary({
  totalScore = 0,
  grade = null,
  gradeEnabled = false,
  mediaType = 'SIBER',
  answers = {}
}) {
  const stats = useMemo(() => {
    const sections = mediaCriteria[mediaType] || []
    let totalQuestions = 0
    let answered = 0

    sections.forEach((section) => {
      if (section && Array.isArray(section.questions)) {
        section.questions.forEach((q) => {
          totalQuestions++
          if (
            answers[q.id] !== undefined &&
            answers[q.id] !== null &&
            String(answers[q.id]).trim() !== ''
          ) {
            answered++
          }
        })
      }
    })

    const unanswered = totalQuestions - answered
    const percentage = totalQuestions > 0 ? Math.round((answered / totalQuestions) * 100) : 0

    return {
      totalQuestions,
      answered,
      unanswered,
      percentage
    }
  }, [mediaType, answers])

  return (
    <div className="bg-slate-900 text-white rounded-xl p-6 shadow-md border border-slate-800 space-y-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600/20 p-3 rounded-xl border border-blue-500/30 text-blue-400">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Live Preview Hasil Penilaian
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Nilai dan grade dihitung real-time berdasarkan pilihan jawaban Anda.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          {/* Score Display */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Total Nilai
            </span>
            <span className="text-2xl font-black tracking-tight text-blue-400 mt-1">
              {totalScore} poin
            </span>
          </div>

          {/* Divider */}
          <div className="h-10 w-px bg-slate-800 hidden md:block"></div>

          {/* Grade Display */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Status Grade
            </span>
            {gradeEnabled ? (
              <span
                className={`text-xl font-bold px-3 py-0.5 rounded-full border mt-1 ${
                  ['Tinggat I', 'Tingkat I'].includes(grade)
                    ? 'bg-green-500/10 text-green-400 border-green-500/20'
                    : [
                          'Tinggat II',
                          'Tingkat II',
                          'Tinggatil',
                          'Tingkat III',
                          'TingkaT III'
                        ].includes(grade)
                      ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      : 'bg-red-500/10 text-red-400 border-red-500/20'
                }`}
              >
                {grade || '-'}
              </span>
            ) : (
              <span className="text-xs font-semibold text-slate-500 mt-2 italic">
                Belum dikonfigurasi
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Statistics Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-800 pt-4 text-xs text-slate-400">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <div>
            Total Pertanyaan:{' '}
            <span className="font-bold text-slate-200">{stats.totalQuestions}</span>
          </div>
          <div>
            Terjawab: <span className="font-bold text-emerald-400">{stats.answered}</span>
          </div>
          <div>
            Belum Terjawab: <span className="font-bold text-yellow-500">{stats.unanswered}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span>Progres Pengisian:</span>
          <span className="font-extrabold text-blue-400">{stats.percentage}%</span>
          <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full" style={{ width: `${stats.percentage}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScoreSummary
