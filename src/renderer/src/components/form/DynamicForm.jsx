import mediaCriteria from '../../constants/mediaCriteria'
import CriteriaCard from './CriteriaCard'

function DynamicForm({
  mediaType = 'SIBER',
  answers = {},
  onAnswerChange,
  validationErrors = {},
  disabled = false
}) {
  const sections = mediaCriteria[mediaType] || []

  if (sections.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-yellow-700 text-sm">
        Kriteria penilaian untuk jenis media <strong>{mediaType}</strong> belum dikonfigurasi.
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <div key={section.id} className="space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <h3 className="text-base font-extrabold text-slate-800 tracking-tight">
              {section.title}
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-5">
            {section.questions.map((question) => (
              <CriteriaCard
                key={question.id}
                question={question}
                selectedValue={answers[question.id] || ''}
                onChange={(value) => onAnswerChange(question.id, value)}
                disabled={disabled}
                error={validationErrors[question.id]}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default DynamicForm
