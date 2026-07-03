import RadioGroup from './RadioGroup'

function CriteriaCard({ question, selectedValue, onChange, disabled = false, error = '' }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <label className="text-sm font-bold text-slate-800 flex items-center gap-1">
          {question.label}
          {question.required && <span className="text-red-500 font-bold">*</span>}
        </label>
      </div>

      {question.description && (
        <p className="text-xs text-slate-400 leading-relaxed">{question.description}</p>
      )}

      <RadioGroup
        name={question.id}
        options={question.options}
        selectedValue={selectedValue}
        onChange={onChange}
        disabled={disabled}
        error={error}
      />
    </div>
  )
}

export default CriteriaCard
