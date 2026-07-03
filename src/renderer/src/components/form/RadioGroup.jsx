function RadioGroup({ name, options, selectedValue, onChange, disabled = false, error = '' }) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 gap-2.5">
        {options.map((option) => {
          const isSelected = String(option.value) === String(selectedValue)
          return (
            <label
              key={option.value}
              className={`flex items-start gap-3 rounded-lg border p-3 text-sm cursor-pointer transition ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/20 text-slate-900 font-medium'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={isSelected}
                onChange={() => !disabled && onChange(option.value)}
                disabled={disabled}
                className="mt-1 h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex-1 flex items-center justify-between">
                <span>{option.label}</span>
                {typeof option.points === 'number' && (
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded ${
                      isSelected ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    +{option.points} Poin
                  </span>
                )}
              </div>
            </label>
          )
        })}
      </div>
      {error && <span className="text-xs text-red-500 block">{error}</span>}
    </div>
  )
}

export default RadioGroup
